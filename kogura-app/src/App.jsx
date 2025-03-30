import { useState, useEffect } from 'react'
import { parseTask } from './deepseek'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import TaskItem from './components/TaskItem'
import TaskEditForm from './components/TaskEditForm'
import DeleteConfirmDialog from './components/DeleteConfirmDialog'
import { formatDate, isPastDate } from './utils/dateUtils'

function App() {
  // 保存用户输入的文字
  const [inputText, setInputText] = useState('')
  // 保存提交后的文字
  const [submittedText, setSubmittedText] = useState('')
  const [parsedResult, setParsedResult] = useState('')
  const [loading, setLoading] = useState(false)
  // 保存所有任务
  const [tasks, setTasks] = useState(() => {
    // 从localStorage加载任务数据
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })
  // 保存编辑中的任务ID
  const [editingId, setEditingId] = useState(null)
  // 保存编辑中的任务内容
  const [editingText, setEditingText] = useState('')
  const [editingDateTime, setEditingDateTime] = useState('')
  const [editingMemo, setEditingMemo] = useState('')
  const [editingDuration, setEditingDuration] = useState('')
  const [editingType, setEditingType] = useState('')
  // 保存要删除的任务ID
  const [deletingId, setDeletingId] = useState(null)
  // 保存折叠的日期
  const [collapsedDates, setCollapsedDates] = useState(() => {
    const saved = localStorage.getItem('collapsedDates')
    return saved ? JSON.parse(saved) : {}
  })

  // 保存任务到localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // 保存折叠状态到localStorage
  useEffect(() => {
    localStorage.setItem('collapsedDates', JSON.stringify(collapsedDates))
  }, [collapsedDates])

  // 点击按钮后执行的函数
  const handleSubmit = async () => {
    setLoading(true) // 显示"加载中"
    try {
      const result = await parseTask(inputText)
      setParsedResult(result) // 显示 AI 返回的内容
      
      // 清理返回的文本，只保留JSON数据部分
      const jsonStr = result.replace(/^```json\n?/, '').replace(/```$/, '').trim()
      const parsedData = JSON.parse(jsonStr)
      
      // 将新任务添加到任务列表中
      setTasks(prevTasks => [...prevTasks, {
        id: Date.now().toString(),
        text: inputText,
        datetime: parsedData.datetime,
        content: parsedData.content,
        duration: parsedData.duration,
        type: parsedData.type,
        done: false
      }])
      setSubmittedText(inputText)
      setInputText('') // 清空输入框
    } catch (error) {
      setParsedResult('エラーが発生しました。')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // 编辑任务
  const handleEdit = (task) => {
    setEditingId(task.id)
    setEditingText(task.text)
    setEditingDateTime(task.datetime)
    setEditingMemo(task.memo || '')
    setEditingDuration(task.duration || '')
    setEditingType(task.type)
  }

  // 保存编辑
  const handleSaveEdit = () => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === editingId) {
        return {
          ...task,
          text: editingText,
          datetime: editingDateTime,
          memo: editingMemo,
          duration: editingDuration,
          type: editingType
        }
      }
      return task
    }))
    setEditingId(null)
  }

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingId(null)
  }

  // 删除任务
  const handleDelete = (taskId) => {
    setDeletingId(taskId)
  }

  // 确认删除任务
  const handleConfirmDelete = () => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== deletingId))
    setDeletingId(null)
  }

  // 取消删除
  const handleCancelDelete = () => {
    setDeletingId(null)
  }

  // 切换任务完成状态
  const toggleTaskDone = (taskId) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        return { ...task, done: !task.done }
      }
      return task
    }))
  }

  // 切换日期折叠状态
  const toggleDateCollapse = (date) => {
    setCollapsedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }))
  }

  // 处理拖拽结束
  const handleDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination } = result
    const sourceDate = source.droppableId
    const destDate = destination.droppableId
    const sourceIndex = source.index
    const destIndex = destination.index

    // 获取源日期和目标日期的任务列表
    const sourceTasks = tasks.filter(task => {
      const taskDate = new Date(task.datetime).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })
      return taskDate === sourceDate
    })

    const destTasks = sourceDate === destDate
      ? sourceTasks
      : tasks.filter(task => {
          const taskDate = new Date(task.datetime).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })
          return taskDate === destDate
        })

    // 获取被移动的任务
    const [movedTask] = sourceTasks.splice(sourceIndex, 1)

    // 如果是跨日期移动，更新任务的日期
    if (sourceDate !== destDate) {
      const destDateObj = new Date(destDate)
      const movedTaskDate = new Date(movedTask.datetime)
      movedTaskDate.setFullYear(destDateObj.getFullYear())
      movedTaskDate.setMonth(destDateObj.getMonth())
      movedTaskDate.setDate(destDateObj.getDate())
      movedTask.datetime = movedTaskDate.toISOString()
    }

    // 将任务插入到目标位置
    destTasks.splice(destIndex, 0, movedTask)

    // 更新任务列表
    setTasks(prevTasks => {
      const otherTasks = prevTasks.filter(task => {
        const taskDate = new Date(task.datetime).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })
        return taskDate !== sourceDate && taskDate !== destDate
      })
      return [...otherTasks, ...destTasks]
    })
  }

  // 按日期分组任务
  const groupedTasks = tasks.reduce((groups, task) => {
    const date = new Date(task.datetime).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(task)
    return groups
  }, {})

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center p-4">
      {/* 主标题 */}
      <h1 className="text-3xl font-bold text-pink-500 mb-4">🐹 ハムちゃんのやること帳</h1>

      {/* 输入框 */}
      <input
        type="text"
        className="border border-gray-300 rounded px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-pink-300"
        placeholder="一言で予定を入力してください（例：火曜日に課題提出）"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        disabled={loading}
      />

      {/* 添加按钮 */}
      <button
        onClick={handleSubmit}
        disabled={!inputText.trim() || loading}
        className={`mt-2 px-4 py-2 rounded transition-colors ${
          loading || !inputText.trim()
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-pink-500 hover:bg-pink-600 text-white'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            追加中...
          </>
        ) : (
          'タスクを追加する'
        )}
      </button>

      {loading && (
        <p className="mt-4 text-gray-500">解析中...</p>
      )}

      {parsedResult && (
        <div className="mt-4 p-4 bg-white rounded shadow text-gray-800">
          <p className="text-sm text-gray-500">AIの解析結果：</p>
          <p className="font-semibold whitespace-pre-wrap">{parsedResult}</p>
        </div>
      )}

      {/* 显示结果 */}
      {submittedText && (
        <p className="mt-4 text-lg text-gray-700">
          ハムちゃんが受け取りました：
          <span className="font-semibold text-pink-600">
            {tasks[tasks.length - 1]?.content || submittedText}
          </span>
        </p>
      )}

      {/* 任务列表 */}
      {tasks.length > 0 && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-xl font-bold text-pink-500 mb-4">📝 タスクリスト</h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="space-y-6">
              {Object.entries(groupedTasks)
                .sort(([dateA], [dateB]) => {
                  // 将日期字符串转换为Date对象进行比较
                  const a = new Date(dateA)
                  const b = new Date(dateB)
                  
                  // 判断是否是过去的日期
                  const isPastA = isPastDate(dateA)
                  const isPastB = isPastDate(dateB)
                  
                  // 如果一个是过去的日期，一个是未来的日期，过去的日期排在后面
                  if (isPastA !== isPastB) {
                    return isPastA ? 1 : -1
                  }
                  
                  // 如果都是过去的日期或都是未来的日期，按时间排序
                  return a - b
                })
                .map(([date, dateTasks]) => {
                  const isPast = isPastDate(date)
                  const isCollapsed = collapsedDates[date] ?? isPast

                  return (
                    <div key={date} className="bg-white rounded-lg shadow overflow-hidden">
                      <div 
                        className={`px-4 py-2 border-b border-pink-100 cursor-pointer hover:bg-pink-100 transition-colors flex justify-between items-center ${
                          isPast ? 'bg-gray-50' : 'bg-pink-50'
                        }`}
                        onClick={() => toggleDateCollapse(date)}
                      >
                        <h3 className={`text-lg font-semibold ${isPast ? 'text-gray-600' : 'text-pink-600'}`}>
                          {formatDate(date)}
                        </h3>
                        {isPast && (
                          <span className="text-sm text-gray-500">
                            {isCollapsed ? '▼' : '▲'}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && (
                        <Droppable droppableId={date}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`divide-y divide-gray-100 ${
                                snapshot.isDraggingOver ? 'bg-pink-50' : ''
                              }`}
                              style={{
                                minHeight: '50px'
                              }}
                            >
                              {dateTasks.map((task, index) => (
                                editingId === task.id ? (
                                  <TaskEditForm
                                    key={task.id}
                                    task={task}
                                    editingText={editingText}
                                    editingDateTime={editingDateTime}
                                    editingMemo={editingMemo}
                                    editingDuration={editingDuration}
                                    editingType={editingType}
                                    onTextChange={setEditingText}
                                    onDateTimeChange={setEditingDateTime}
                                    onMemoChange={setEditingMemo}
                                    onDurationChange={setEditingDuration}
                                    onTypeChange={setEditingType}
                                    onSave={handleSaveEdit}
                                    onCancel={handleCancelEdit}
                                  />
                                ) : (
                                  <TaskItem
                                    key={task.id}
                                    task={task}
                                    index={index}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onToggleDone={toggleTaskDone}
                                  />
                                )
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      )}
                    </div>
                  )
                })}
            </div>
          </DragDropContext>
        </div>
      )}

      {/* 删除确认对话框 */}
      {deletingId && (
        <DeleteConfirmDialog
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  )
}

export default App

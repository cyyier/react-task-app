import { Draggable } from '@hello-pangea/dnd'
import { formatTime } from '../utils/dateUtils'

/**
 * 任务项组件
 * 功能：
 * - 显示任务详情（文本、时间、类型、时长、备注）
 * - 支持完成状态切换
 * - 支持编辑和删除操作
 * - 支持拖拽排序
 * - 显示时间状态和备注
 * 
 * 属性：
 * @param {Object} task - 任务对象
 * @param {Function} onEdit - 编辑任务回调
 * @param {Function} onDelete - 删除任务回调
 * @param {Function} onToggleDone - 切换完成状态回调
 * @param {number} index - 任务在列表中的索引
 * 
 * 样式：
 * - 使用Tailwind CSS
 * - 拖拽时显示视觉反馈
 * - 完成的任务显示删除线
 * - 不同类型的任务使用不同的颜色标识
 */
const TaskItem = ({ task, onEdit, onDelete, onToggleDone, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 bg-white hover:bg-pink-50 transition-colors ${
            snapshot.isDragging ? 'shadow-lg' : ''
          }`}
        >
          <div className="flex items-start gap-4">
            {/* 完成状态复选框 */}
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => onToggleDone(task.id)}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
            />

            {/* 任务内容 */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className={`text-lg ${task.done ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.content || task.text}
                </p>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.type === 'task' ? 'bg-blue-100 text-blue-800' :
                  task.type === 'schedule' ? 'bg-green-100 text-green-800' :
                  task.type === 'reminder' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.type === 'task' ? 'タスク' :
                   task.type === 'schedule' ? '予定' :
                   task.type === 'reminder' ? 'リマインダー' :
                   'その他'}
                </span>
              </div>

              {/* 时间信息 */}
              <div className="mt-1 text-sm text-gray-500">
                <p>時間: {formatTime(task.datetime)}</p>
                {task.duration && (
                  <p>所要時間: {task.duration}</p>
                )}
              </div>

              {/* 备注 */}
              {task.memo && (
                <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {task.memo}
                </p>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(task)}
                className="p-1 text-gray-500 hover:text-pink-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 text-gray-500 hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default TaskItem
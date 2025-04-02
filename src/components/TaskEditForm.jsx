/**
 * 任务编辑表单组件
 * 功能：
 * - 提供任务编辑表单界面
 * - 支持编辑所有任务属性（文本、时间、类型、时长、备注）
 * - 提供保存和取消操作
 * 
 * 属性：
 * @param {Object} task - 要编辑的任务对象
 * @param {string} editingText - 编辑中的任务文本
 * @param {string} editingDateTime - 编辑中的任务时间
 * @param {string} editingMemo - 编辑中的任务备注
 * @param {string} editingDuration - 编辑中的任务时长
 * @param {string} editingType - 编辑中的任务类型
 * @param {Function} onTextChange - 文本变更回调
 * @param {Function} onDateTimeChange - 时间变更回调
 * @param {Function} onMemoChange - 备注变更回调
 * @param {Function} onDurationChange - 时长变更回调
 * @param {Function} onTypeChange - 类型变更回调
 * @param {Function} onSave - 保存回调
 * @param {Function} onCancel - 取消回调
 * 
 * 样式：
 * - 使用Tailwind CSS
 * - 响应式布局
 * - 表单元素统一样式
 */
const TaskEditForm = ({
  task,
  editingText,
  editingDateTime,
  editingMemo,
  editingDuration,
  editingType,
  onTextChange,
  onDateTimeChange,
  onMemoChange,
  onDurationChange,
  onTypeChange,
  onSave,
  onCancel
}) => {
  return (
    <div className="p-4 bg-white">
      <div className="space-y-4">
        {/* 任务文本 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            タスク内容
          </label>
          <input
            type="text"
            value={editingText}
            onChange={(e) => onTextChange(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        {/* 任务时间 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            日時
          </label>
          <input
            type="datetime-local"
            value={editingDateTime.slice(0, 16)}
            onChange={(e) => onDateTimeChange(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        {/* 任务类型 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            タイプ
          </label>
          <select
            value={editingType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            <option value="task">タスク</option>
            <option value="schedule">予定</option>
            <option value="reminder">リマインダー</option>
            <option value="other">その他</option>
          </select>
        </div>

        {/* 任务时长 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            所要時間
          </label>
          <input
            type="text"
            value={editingDuration}
            onChange={(e) => onDurationChange(e.target.value)}
            placeholder="例：1時間"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        {/* 任务备注 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メモ
          </label>
          <textarea
            value={editingMemo}
            onChange={(e) => onMemoChange(e.target.value)}
            rows="3"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskEditForm 
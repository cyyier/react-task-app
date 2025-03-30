/**
 * 删除确认对话框组件
 * 功能：
 * - 显示删除确认对话框
 * - 提供确认和取消操作
 * - 防止误删任务
 * 
 * 属性：
 * @param {Function} onConfirm - 确认删除回调
 * @param {Function} onCancel - 取消删除回调
 * 
 * 样式：
 * - 使用Tailwind CSS
 * - 模态框样式
 * - 半透明背景遮罩
 * - 居中显示对话框
 */
const DeleteConfirmDialog = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          タスクを削除しますか？
        </h3>
        <p className="text-gray-600 mb-6">
          この操作は取り消すことができません。
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmDialog 
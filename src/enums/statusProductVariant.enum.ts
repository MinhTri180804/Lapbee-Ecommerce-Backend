/**
 * Field: status
 *
 * Ý nghĩa:
 * - Xác định tình trạng hiện tại của biến thể sản phẩm (product_variant)
 *
 * Các giá trị nên có:
 * - 'active'        → Đang hiển thị và có thể mua
 * - 'inactive'      → Không hiển thị, tạm ẩn khỏi frontend
 * - 'out_of_stock'  → Hết hàng tạm thời
 * - 'discontinued'  → Ngừng bán hoàn toàn
 * - 'draft'         → Đang soạn thảo, chưa được công khai
 * - 'pre_order'     → Sắp bán, cho phép đặt trước
 * - 'archived'      → Đã ngừng bán từ lâu, chỉ lưu trữ nội bộ
 */

export enum StatusProductVariantEnum {
  ACTIVE = 0,
  INACTIVE = 1,
  OUT_OF_STOCK = 2,
  DISCONTINUED = 3,
  DRAFT = 4
}

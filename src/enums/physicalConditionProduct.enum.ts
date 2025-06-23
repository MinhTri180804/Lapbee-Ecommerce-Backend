/**
 * physicalCondition — Tình trạng vật lý của sản phẩm (áp dụng cho sản phẩm used/refurbished).
 *
 * Các giá trị enum được hỗ trợ:
 *
 * - 'like_new'   : Gần như mới, không trầy xước, dùng rất ít
 * - 'excellent'  : Có thể có 1–2 vết xước nhỏ, nhìn kỹ mới thấy (ngoại hình đẹp)
 * - 'good'       : Có vài vết trầy xước nhẹ, không ảnh hưởng chức năng (ngoại hình khá)
 * - 'fair'       : Có vết trầy rõ hoặc mòn nhẹ, vẫn sử dụng tốt (trầy xước nhẹ)
 * - 'poor'       : Trầy xước nhiều, nứt, móp nhưng vẫn hoạt động (trầy xước nhiều)
 * - 'broken'     : Bị hỏng một phần, bán để sửa hoặc lấy linh kiện (bị hỏng, cần sửa)
 */
export enum PhysicalConditionProductEnum {
  LIKE_NEW = 0,
  EXCELLENT = 1,
  GOOD = 3,
  FAIR = 4,
  POOR = 5,
  BROKEN = 6
}

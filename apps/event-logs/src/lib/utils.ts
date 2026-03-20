// 格式化 JSON 预览，防止界面上出现 [object Object]
export const formatJsonPreview = (raw: any) => {
  if (!raw) return 'null';
  return typeof raw === 'object' ? JSON.stringify(raw) : String(raw);
};

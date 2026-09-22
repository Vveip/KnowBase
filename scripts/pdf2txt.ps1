# 此脚本已作废。
#
# 原因：
#   1. 依赖 Microsoft Word 的 PDF Reflow，本机安装的是 WPS，无 Word；
#   2. 文件以 UTF-8 无 BOM 保存，Windows PowerShell 5.1 会按 GBK 解码导致语法错乱。
#
# 请改用 Node 方案：  node scripts\pdf2txt.mjs [章节关键字]

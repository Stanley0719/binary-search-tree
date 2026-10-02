# Binary Search Tree Demo

這個專案已經改成 BST 視覺化互動頁面，展示二元搜尋樹的插入、搜尋、刪除與走訪流程。

## 本機預覽

在專案根目錄執行：

```bash
python -m http.server 8000
```

然後在瀏覽器開啟：

```text
http://localhost:8000/
```

## 檔案說明

- `index.html`：頁面結構
- `styles.css`：視覺與動畫樣式
- `script.js`：BST 演算法與互動邏輯

## 目前調整

- 移除 C++ 演算法區塊
- 修正最後一個掉落中的數字會在動畫結束後自動淡出
- 優化 BST 的插入 / 搜尋 / 刪除演示流程

## GitHub

原始倉庫：

https://github.com/Stanley0719/binary-search-tree

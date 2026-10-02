# BST Adventure Game

這是一個可玩的二元搜尋樹（Binary Search Tree, BST）控制台遊戲。你不只是看程式碼，而是直接操作樹：

- 插入數字
- 搜尋數字
- 刪除節點
- 觀看中序排序結果
- 查看整棵樹的結構
- 重置遊戲

## 遊戲玩法

你扮演一名 BST 冒險者，樹是一個神奇的數字迷宮：

- 比根節點小的值往左走
- 比根節點大的值往右走
- 你的任務是管理整棵樹，完成各種操作

## 專案內容

- `main.cpp`：完整的遊戲邏輯與 BST 實作
- `CMakeLists.txt`：CMake 設定
- `.github/workflows/build.yml`：GitHub Actions 自動建置

## 本機建置

### Linux / macOS

```bash
cmake -S . -B build
cmake --build build
./build/bst_demo
```

### Windows (PowerShell)

```powershell
cmake -S . -B build
cmake --build build
.\build\bst_demo.exe
```

## 螢幕範例

```text
===== 二元搜尋樹冒險遊戲 =====
1. 插入數字
2. 搜尋數字
3. 刪除數字
4. 看中序結果
5. 看樹狀結構
6. 重置樹
7. 離開遊戲
```

## 重點

這個版本不是單純的資料結構示範，而是做成一個可操作的小遊戲，符合你原本要的「把那個遊戲做出來」需求。

## GitHub

目前已推送到：

https://github.com/Stanley0719/binary-search-tree

如需重新推送更新：

```bash
git add .
git commit -m "BST adventure game update"
git push origin main
```

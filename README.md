# Binary Search Tree Demo

這是一個簡單但完整的二元搜尋樹（Binary Search Tree, BST）C++ 範例，展示如何：

- 插入新節點
- 搜尋指定數值
- 刪除節點
- 進行中序走訪（sorted order）
- 遞迴釋放整棵樹的記憶體

## 專案概覽

- `main.cpp`：BST 的完整實作與示範程式
- `CMakeLists.txt`：CMake 建置設定
- `.github/workflows/build.yml`：GitHub Actions 自動建置

## 運作原理

二元搜尋樹的核心規則是：

- 比根節點小的值放左子樹
- 比根節點大的值放右子樹
- 相等的值不重複插入

這使得中序走訪會自動得到排序後的結果。

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

### Windows (如果使用 Debug 輸出)

```powershell
cmake -S . -B build
cmake --build build --config Debug
.\build\Debug\bst_demo.exe
```

## 範例輸出

```text
中序走訪：20 30 40 50 60 70 80 
搜尋 40：找到
搜尋 99：未找到
刪除 50 後：20 30 40 60 70 80 
```

## 專案檔案說明

### `main.cpp`

包含以下功能：

- `insert()`：插入節點
- `search()`：搜尋值
- `removeNode()`：刪除節點
- `inorder()`：中序走訪
- `destroyTree()`：釋放樹記憶體

### `CMakeLists.txt`

設定 `C++17` 編譯標準，並產生可執行檔 `bst_demo`。

## GitHub 發布

若你想把這個專案推到 GitHub，請先建立一個空 repository，然後執行：

```bash
git branch -M main
git remote add origin https://github.com/<你的帳號>/<你的repo>.git
git push -u origin main
```

例如：

```bash
git branch -M main
git remote add origin https://github.com/Stanley0719/binary-search-tree.git
git push -u origin main
```

## License

這個專案適合用於學習與展示，無需額外授權限制。

📘 Operating System – Memory Management Notes

A quick and structured guide to understand Virtual Memory, Paging, Page Faults, and Page Replacement Algorithms.

🧠 Virtual Memory

Virtual Memory is a technique used by the operating system to make a computer appear to have more RAM than it actually has.

🔑 Key Concepts
Programs feel like they have large memory.
Data is divided between:
RAM
Disk (Swap Space)
📄 Paging

Paging is a memory management technique that divides memory into fixed-size blocks.

📌 Definitions
Page → A block of a program
Frame → A block of RAM
⚙️ How It Works
Program is divided into pages
RAM is divided into frames

OS maps:

Page → Frame
Mapping is stored in a Page Table
✅ Important Rule
Page size = Frame size (always)
⚠️ Page Fault

A page fault occurs when a program tries to access a page not present in RAM.

📂 Types of Page Fault
1. Valid Page Fault
Page exists on disk
OS loads it into RAM
2. Invalid Page Fault
Page does not exist
Leads to error or crash
📥 Demand Paging

Pages are loaded into memory only when required.

🚀 Advantages
Saves memory
Improves system performance
🔁 Page Replacement Algorithms

When memory is full, the OS replaces existing pages.

🟢 Least Recently Used (LRU)

Removes the page that was not used for the longest time.

🧪 Example
Frames = 3
Reference String: 1, 2, 3 → Memory full
Next: 1 → already present
Next: 4 → replace least recently used (2)
🔵 Optimal Page Replacement

Removes the page that will not be used for the longest time in the future.

❗ Limitation
Not used in real systems
Future access cannot be predicted
🧱 Data Structures Used

To efficiently implement paging and LRU:

🎯 Requirements
Store pages
Track usage
Perform fast operations
🛠️ Common Structures
Data Structure	Use Case
Array / List	Store pages in memory
Queue	FIFO algorithm
Stack	Basic LRU
HashMap	Page → Frame mapping (O(1))
Doubly Linked List	Efficient LRU with HashMap
📝 Summary
Virtual memory extends RAM using disk
Paging divides memory into fixed-size blocks
Page faults occur when page is missing in RAM
Demand paging loads pages only when needed
LRU and Optimal are key replacement algorithms
Efficient implementation uses proper data structures
📚 Quick Revision
Page = Program block
Frame = RAM block
Page Table = Mapping
LRU = Past-based
Optimal = Future-based
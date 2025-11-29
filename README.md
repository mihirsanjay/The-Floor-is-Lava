# 🌋 FLOOR IS LAVA! - Advanced Pathfinding Evacuation Simulator

**Floor is LAVA!** is a cutting-edge, real-time interactive evacuation simulator that demonstrates how intelligent agents escape a volcanic disaster using optimized **pathfinding algorithms**. Built with modern web technologies and advanced data structures, this simulator showcases real-world applications of computer science in emergency response systems, robotics, and AI navigation.

> 🔥 **Experience the thrill of escape!** Watch numbered agents navigate through spreading lava using A*, BFS, Dijkstra, and DFS algorithms with stunning visual effects and professional gaming UI.

---

## 🌐 Live Demo  
👉 **[Launch Floor is LAVA!](https://mihir.github.io/Visupath-evacuation-simulator/)**

*Compatible with all modern browsers • Responsive design • No installation required*

---

## 🎮 **COMPREHENSIVE FEATURE SET**

### 🧠 **Advanced Algorithm Engine**
- **🚀 A\* Algorithm**: Heuristic-based optimal pathfinding with Manhattan distance
- **🌊 Breadth-First Search (BFS)**: Guaranteed shortest path in unweighted graphs  
- **🏔️ Dijkstra's Algorithm**: Optimal pathfinding with configurable edge weights
- **🌿 Depth-First Search (DFS)**: Memory-efficient exploration algorithm
- **⚡ Binary Heap Implementation**: O(log n) priority queue operations for A* and Dijkstra
- **🔄 Algorithm Comparison Mode**: Run all 4 algorithms simultaneously with color-coded paths

### 🎯 **Dual Agent Placement Systems**
- **🎲 Random Spawn Mode**: Automatic agent distribution avoiding obstacles
- **🖱️ Manual Positioning Mode**: Drag-and-drop agents to strategic locations
- **📍 Smart Collision Detection**: Prevents overlapping and invalid placements
- **🔢 Numbered Agents (1-100)**: Individual tracking and identification
- **📊 Real-time Agent Counter**: Dynamic adjustment without simulation reset

### 🔥 **Dynamic Fire Simulation**
- **🌋 Intelligent Fire Spread**: Cellular automata-based lava propagation
- **⚡ Configurable Spread Speed**: 500ms to 3000ms intervals
- **🎯 Toggle Fire Placement**: Shift+Click to add/remove fire tiles
- **🚫 Obstacle Awareness**: Fire spreads around walls and exits
- **📍 Coordinate-Based Tracking**: Precise fire location monitoring

### 🎨 **Professional Gaming Interface**
- **🎮 Futuristic UI Design**: Sci-fi themed with neon glows and gradients
- **⚡ Responsive Layout**: 3-panel desktop, mobile-optimized stacking
- **🌈 Algorithm-Specific Colors**: 
  - A* → Gold (#FFD700)
  - BFS → Dark Turquoise (#00CED1) 
  - Dijkstra → Lime Green (#32CD32)
  - DFS → Tomato (#FF6347)
- **📊 Real-time Statistics Dashboard**: Live tracking of survivors, casualties, and performance
- **🎯 Interactive Canvas**: 600x600 grid with coordinate system overlay

### 🕹️ **Advanced Interaction System**

#### **🖱️ Mouse Controls**
| Action | Control | Function |
|--------|---------|----------|
| 🟫 **Build Walls** | Left-click + Drag | Create barriers and obstacles |
| 🟢 **Place Exits** | Right-click + Drag | Set safe evacuation points |
| 🔥 **Toggle Fire** | Shift + Left-click | Add/remove lava tiles |
| 🏃 **Move Agents** | Drag in Manual Mode | Reposition agents strategically |

#### **⌨️ Keyboard Controls**
- **Spacebar**: Prevented from scrolling (enhanced UX)
- **Arrow Keys**: Legacy person movement (maintained for compatibility)

#### **🎛️ Control Panels**

**Left Panel - Algorithm Control:**
- Algorithm selector (A*, BFS, Dijkstra, DFS)
- Compare all algorithms toggle
- Path visualization toggle  
- Simulation controls (Start/Stop/Reset)
- Wall preservation option

**Right Panel - Game Settings:**
- Agent count slider (1-100)
- Agent placement mode selector
- Animation speed control (50ms-500ms)
- Fire spread speed control (500ms-3000ms)
- Dynamic instruction display

### 📊 **Comprehensive Analytics System**
- **🎯 Algorithm Performance Tracking**: Execution time and path optimality
- **📈 Survival Rate Analysis**: Success percentage per algorithm
- **📍 Escape Route Mapping**: "Agent X → Exit (Y, Z)" tracking
- **💀 Casualty Location Recording**: "Agent X 💀 at (Y, Z)" documentation
- **📋 Real-time Statistics**:
  - Total agents deployed
  - Successful evacuations  
  - Lava casualties
  - Simulation steps count

### 🎮 **Advanced Simulation Features**

#### **🚦 State Management**
- **▶️ Start/Stop Controls**: Real-time simulation control
- **⏸️ Pause and Resume**: Modify environment mid-simulation
- **🔄 Smart Reset Options**: Selective clearing (preserve walls toggle)
- **🔒 Simulation Locks**: Prevent editing during active runs

#### **👥 Agent Intelligence**
- **🧠 Individual Pathfinding**: Each agent calculates independent optimal routes
- **💀 Death State Handling**: Skull emoji display for lava casualties  
- **✅ Escape State Management**: Agents disappear upon reaching exits
- **🎯 Collision Avoidance**: Agents cannot overlap during placement

#### **🌋 Environmental Dynamics**
- **📈 Progressive Fire Spread**: Expanding danger zones over time
- **🚧 Obstacle Integration**: Fire blocked by walls, flows around barriers
- **🎯 Multi-Exit Support**: Multiple safe zones for evacuation routes
- **📍 Coordinate Grid System**: Precise 20x20 positioning reference

### 🎨 **Visual Excellence**
- **🌈 Path Highlighting**: Persistent trail visualization during and after simulation
- **💫 Smooth Animations**: Configurable speed from 50ms to 500ms
- **🎯 Agent Numbering**: Clear identification with white numbers on blue circles
- **💀 Death Visualization**: Skull emojis for casualties
- **🌊 Translucent Overlays**: 60% opacity path traces that overlay fire spread
- **🎮 Gaming Aesthetics**: Professional color scheme with glowing effects

---

## 🧠 **Algorithm Implementation Details**

### **Technical Architecture**

| Algorithm | Data Structure | Time Complexity | Space Complexity | Optimality |
|-----------|----------------|-----------------|------------------|------------|
| **A\*** | MinHeap + HashMap | O((V+E) log V) | O(V) | ✅ Optimal with admissible heuristic |
| **Dijkstra** | MinHeap + HashMap | O((V+E) log V) | O(V) | ✅ Optimal for weighted graphs |
| **BFS** | Queue (FIFO) | O(V+E) | O(V) | ✅ Optimal for unweighted graphs |
| **DFS** | Stack (LIFO) | O(V+E) | O(V) | ❌ Not optimal, explores deeply |

### **Advanced Implementation Features**
- **🔧 Custom MinHeap Class**: Hand-coded binary heap for optimal performance
- **🎯 Manhattan Heuristic**: Distance calculation for A* guidance  
- **🌐 Neighbor Generation**: Efficient 4-directional movement validation
- **🔄 Path Reconstruction**: Backtracking from goal to start
- **⚡ Early Termination**: Algorithms stop immediately upon finding exit

---

## 🎮 **Complete User Guide**

### **🚀 Getting Started**
1. **Load the Application**: Open in any modern web browser
2. **Choose Agent Placement**: Select Random or Manual mode
3. **Set Agent Count**: Use slider (1-100 agents)
4. **Design Environment**: 
   - Left-click/drag for walls
   - Right-click/drag for exits  
   - Shift+click for fire placement
5. **Select Algorithm**: Choose from dropdown or enable comparison mode
6. **Configure Speed**: Adjust agent animation and fire spread rates
7. **Start Simulation**: Click 🚀 Start Simulation button

### **🎯 Advanced Techniques**
- **Strategic Placement**: Use manual mode to test specific scenarios
- **Algorithm Racing**: Compare mode shows all algorithms simultaneously  
- **Speed Analysis**: Slow down animation to study pathfinding decisions
- **Survival Optimization**: Experiment with exit placement for maximum survival rates

### **📊 Performance Testing**
- **Bottleneck Analysis**: Create narrow passages to test algorithm efficiency
- **Scalability Testing**: Increase agent count to stress-test performance
- **Fire Spread Studies**: Adjust fire speed to analyze escape time windows
- **Path Optimization**: Compare algorithm path lengths and execution times

---

## 🏗️ **Technical Architecture**

```
Floor-is-LAVA/
├── index.html              # Modern gaming UI with responsive design
├── style.css              # Comprehensive styling (embedded)
├── app.js                 # Core application logic & UI management
│   ├── 🎮 Game State Management
│   ├── 🖱️ Advanced Interaction System  
│   ├── 🎨 Canvas Rendering Engine
│   ├── 👥 Agent Management System
│   ├── 🔥 Fire Simulation Engine
│   ├── 📊 Statistics & Analytics
│   └── 🎯 Animation Controller
└── utils/                 # Optimized Algorithm Implementations  
    ├── astar.js          # A* with binary heap optimization
    ├── bfs.js            # Breadth-first search with queue
    ├── dfs.js            # Depth-first search with stack  
    ├── dijkstra.js      # Dijkstra with priority queue
    └── helpers.js        # Shared utilities & data structures
        ├── MinHeap Class (Binary heap implementation)
        ├── cellKey() function (Coordinate mapping)
        ├── getNearestExitHeuristic() (A* heuristic)
        └── getNeighbors() (Movement validation)
```

### **🔧 Core Systems**

**🎮 Rendering Engine (`drawGrid()`, `drawAgents()`, `drawCoordinates()`)**
- 60 FPS canvas rendering with efficient redraw cycles
- Layered rendering: paths → obstacles → agents → coordinates
- Real-time coordinate system with perfect pixel alignment

**👥 Agent Management (`generateAgents()`, `getAgentAt()`, `isValidAgentPosition()`)**  
- Dynamic agent spawning with collision detection
- Individual agent state tracking (alive/dead/escaped)
- Intelligent positioning algorithms for manual placement

**🔥 Fire Simulation (`spreadFire()`, `startFireSpread()`, `stopFireSpread()`)**
- Cellular automata fire propagation system
- Configurable spread intervals with real-time adjustment
- Obstacle-aware expansion patterns

**📊 Analytics Engine (`updateEscapedAgentsList()`, `updateDeadAgentsList()`)**
- Real-time statistics calculation and display
- Comprehensive escape/death tracking with coordinates
- Performance metrics and algorithm comparison data

---

## 🎯 **Use Cases & Applications**

### **🎓 Educational Applications**
- **Computer Science Courses**: Demonstrate pathfinding algorithms visually
- **Data Structures**: Show heap, queue, and stack operations in action  
- **Algorithm Analysis**: Compare time/space complexity in real scenarios
- **Game Development**: Teach AI navigation and pathfinding techniques

### **🏢 Professional Applications**  
- **Emergency Planning**: Simulate building evacuations and optimize exit placement
- **Robotics Research**: Test navigation algorithms for autonomous systems
- **Smart Buildings**: Model intelligent evacuation systems with IoT integration
- **Traffic Flow**: Analyze crowd movement patterns and bottleneck identification

### **🎮 Gaming & Entertainment**
- **Algorithm Visualization**: Interactive learning tool for students and developers
- **Strategy Gaming**: Demonstrate tactical positioning and route optimization
- **Competitive Analysis**: Race algorithms against each other
- **Educational Gaming**: Gamified approach to learning computer science concepts

---

## 🚀 **Performance Optimizations**

### **⚡ Algorithm Enhancements**
- **Binary Heap Implementation**: O(log n) priority queue operations vs O(n log n) array sorting
- **Efficient Neighbor Generation**: Cached boundary checking and obstacle validation
- **Early Path Termination**: Stop searching immediately upon finding any exit
- **Memory Management**: Optimized data structures to minimize garbage collection

### **🎨 Rendering Optimizations**
- **Canvas Layer Management**: Efficient redraw cycles with minimal clearing
- **Path Caching**: Pre-computed path visualization for smooth animation
- **Event Throttling**: Optimized mouse movement handling for drag operations
- **Responsive Design**: CSS Grid and Flexbox for optimal layout performance

---

## 🔬 **Future Enhancements**

### **🎮 Gameplay Features**
- **Multi-Level Buildings**: Stairs, elevators, and floor-to-floor navigation
- **Agent Types**: Different speeds, panic behaviors, and special abilities
- **Environmental Hazards**: Smoke, debris, and dynamic obstacles
- **Cooperative Pathfinding**: Agent-to-agent communication and group behavior

### **📊 Analytics & Visualization**
- **Heatmap Generation**: Show most/least traveled paths
- **Performance Benchmarking**: Detailed algorithm comparison charts  
- **Export Functionality**: Save scenarios and results as JSON/CSV
- **Replay System**: Record and playback simulations with step-by-step analysis

### **🛠️ Technical Improvements**  
- **Web Workers**: Move pathfinding calculations to background threads
- **WebGL Acceleration**: Hardware-accelerated rendering for larger grids
- **Real-time Multiplayer**: Collaborative scenario building and testing
- **API Integration**: Connect with external mapping and emergency response systems

---


### **🎯 Project Vision**
*"Making complex algorithms accessible through interactive visualization, bridging the gap between theoretical computer science and real-world applications in emergency response and intelligent systems."*

---

## 📄 **Open Source License**

This project is proudly open-source under the **MIT License**.

**You are free to:**
- ✅ Use commercially and personally
- ✅ Modify and distribute  
- ✅ Create derivative works
- ✅ Include in larger projects

**Attribution appreciated but not required!**

---

## 🌟 **Community & Contributions**

### **🚀 Contributing**
We welcome contributions! Areas where you can help:
- 🐛 Bug fixes and performance improvements
- ✨ New algorithm implementations  
- 🎨 UI/UX enhancements
- 📚 Documentation improvements
- 🧪 Test case development

### **📈 Project Statistics**
- 🔥 **Lines of Code**: 800+ (JavaScript/HTML/CSS)
- ⚡ **Performance**: 60 FPS animation on modern browsers
- 🎯 **Browser Support**: Chrome, Firefox, Safari, Edge
- 📱 **Mobile Compatibility**: Responsive design for all devices

---

## 🎊 **Acknowledgments**

Special thanks to:
- 🎓 **Computer Science Community**: For algorithm research and optimization techniques
- 🎮 **Game Development Community**: For UI/UX inspiration and best practices  
- 🔬 **Academic Research**: For pathfinding algorithm theoretical foundations
- 🌐 **Open Source Community**: For collaborative development principles

---

> **🌋 Ready to escape the lava?** 
> 
> **[🚀 LAUNCH FLOOR IS LAVA! →](https://mihir.github.io/Visupath-evacuation-simulator/)**
>
> ⭐ **Star this repo if you found it interesting!**  
> 🔄 **Share with fellow developers and educators**  
> 💬 **Feedback and suggestions always welcome**

---

*Built with ❤️ using vanilla JavaScript, HTML5 Canvas, and advanced algorithms*





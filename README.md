# Tugas UAS Mata Kuliah Sistem Media Interaktif
## Final Exam Project: Interactive Media Systems

**Topik / Topic:**  
Eksplorasi Tata Surya Interaktif & Simulasi Gravitasi  
*Interactive Solar System Exploration & Gravity Simulation*

---

### Deskripsi Proyek / Project Description

**(ID)**  
Proyek ini dikembangkan sebagai pemenuhan Tugas Akhir Semester (UAS) untuk mata kuliah Sistem Media Interaktif. Aplikasi ini merupakan media pembelajaran berbasis web yang menyajikan visualisasi tiga dimensi (3D) dari sistem tata surya kita. Berbeda dengan model statis konvensional, sistem ini menawarkan fitur interaktif dan simulasi fisika yang mendalam.

Fitur utama meliputi:
1.  **Visualisasi Tata Surya Real-Time**: Simulasi orbit 8 planet utama mengelilingi Matahari dengan kecepatan orbit relatif yang akurat (berdasarkan Hukum Kepler).
2.  **Antarmuka Ramah Anak (Child-Friendly UI)**: Desain antarmuka modern dan gamified untuk meningkatkan keterlibatan pengguna muda dalam mempelajari astronomi.
3.  **Data Ilmiah Komprehensif**: Menyajikan data astronomi detail (Massa, Gravitasi, Suhu, dll.) yang terintegrasi secara dinamis.
4.  **Simulasi Gravitasi (Gravity Sandbox)**: Modul eksperimental yang memvisualisasikan kelengkungan ruang-waktu (spacetime curvature) akibat massa benda, mendemonstrasikan prinsip dasar gravitasi secara visual dan interaktif.

**(EN)**  
This project is developed as a fulfillment of the Final Semester Exam (UAS) for the Interactive Media Systems course. This application is a web-based educational medium presenting a three-dimensional (3D) visualization of our solar system. Unlike conventional static models, this system offers interactive features and deep physics simulations.

Key features include:
1.  **Real-Time Solar System Visualization**: Simulation of the 8 major planets orbiting the Sun with accurate relative orbital speeds (based on Kepler's Laws).
2.  **Child-Friendly UI**: A modern and gamified interface design to enhance young users' engagement in learning astronomy.
3.  **Comprehensive Scientific Data**: Presents detailed astronomical data (Mass, Gravity, Temperature, etc.) integrated dynamically.
4.  **Gravity Simulation (Gravity Sandbox)**: An experimental module visualizing spacetime curvature caused by mass, demonstrating the fundamental principles of gravity visually and interactively.

---

### Teknologi yang Digunakan / Tech Stack

Proyek ini dibangun menggunakan teknologi web modern untuk menjamin performa tinggi dan pengalaman visual yang responsif:
*This project is built using modern web technologies to ensure high performance and responsive visual experiences:*

*   **Core Framework**: [React.js](https://react.dev/) (v19) - *Library JavaScript untuk membangun antarmuka pengguna.*
*   **3D Engine & Rendering**: 
    *   [Three.js](https://threejs.org/) - *Engine grafik 3D berbasis WebGL.*
    *   [React Three Fiber (R3F)](https://docs.pmnd.rs/react-three-fiber) - *Reconciler React untuk Three.js.*
    *   [React Three Drei](https://github.com/pmndrs/drei) - *Koleksi helper abstraksi untuk R3F.*
*   **Animation**: 
    *   [GSAP](https://gsap.com/) (GreenSock Animation Platform) - *Untuk transisi kamera yang presisi.*
    *   [Framer Motion](https://www.framer.com/motion/) - *Untuk animasi antarmuka pengguna (UI).*
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) - *Framework CSS utility-first.*
*   **Routing**: [Wouter](https://github.com/molefrog/wouter) - *Router minimalis untuk navigasi halaman.*
*   **Build Tool**: [Vite](https://vitejs.dev/) - *Frontend build tool yang sangat cepat.*

---

### Cara Instalasi dan Menjalankan / Installation and Running

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda (Localhost):
*Follow these steps to run this project in your local environment (Localhost):*

**Prasyarat / Prerequisites**:
Pastikan Anda telah menginstal **Node.js** (versi 16 atau lebih baru) dan **npm**.
*Ensure you have installed **Node.js** (version 16 or newer) and **npm**.*

**Langkah-langkah / Steps**:

1.  **Clone atau Unduh Proyek / Clone or Download Project**
    Ekstrak folder proyek ke komputer Anda.
    *Extract the project folder to your computer.*

2.  **Instalasi Dependensi / Install Dependencies**
    Buka terminal atau Command Prompt di dalam folder proyek, lalu jalankan perintah:
    *Open a terminal or Command Prompt inside the project folder, then run the command:*
    ```bash
    npm install
    ```

3.  **Jalankan Server Pengembangan / Run Development Server**
    Setelah instalasi selesai, jalankan perintah berikut untuk memulai aplikasi:
    *After installation is complete, run the following command to start the application:*
    ```bash
    npm run dev
    ```

4.  **Buka di Browser / Open in Browser**
    Aplikasi biasanya akan berjalan di alamat berikut (cek terminal Anda untuk alamat pastinya):
    *The application will usually run at the following address (check your terminal for the exact address):*
    > `http://localhost:5173`

---

### Catatan Tambahan / Additional Notes

*   **Audio**: Aplikasi ini menggunakan audio latar belakang. Pastikan volume perangkat Anda aktif untuk pengalaman terbaik.
    *   *Audio: This application uses background audio. Ensure your device volume is on for the best experience.*
*   **Navigasi 3D**: Gunakan *Mouse Drag* untuk memutar kamera, dan *Scroll* untuk memperbesar/memperkecil (zoom).
    *   *3D Navigation: Use Mouse Drag to rotate the camera, and Scroll to zoom in/out.*

---


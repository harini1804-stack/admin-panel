// ==========================
// USER/POST LINE CHART SETUP
// ==========================
let userChart;
const userCanvas = document.getElementById("userChart").getContext("2d");

let activeTab = "today";
let activeGraph = "user";

// Chart Data
const chartData = {
  today: {
    labels: ["12AM", "2AM", "4AM", "6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM"],
    user: [20, 30, 15, 40, 35, 60, 45, 30, 25, 15, 10, 5],
    post: [18, 22, 25, 38, 42, 50, 33, 28, 20, 18, 12, 6]
  },
  weekly: {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    user: [12, 19, 3, 25, 10, 4, 7],
    post: [4, 14, 6, 22, 12, 8, 10]
  },
  monthly: {
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    user: Array.from({ length: 30 }, () => Math.floor(Math.random() * 20)),
    post: Array.from({ length: 30 }, () => Math.floor(Math.random() * 25))
  },
  yearly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    user: [20, 30, 15, 40, 35, 60, 45, 30, 25, 15, 10, 5],
    post: [18, 22, 25, 38, 42, 50, 33, 28, 20, 18, 12, 6]
  }
};

function createUserChart(labels, data) {
  if (userChart) userChart.destroy();

  userChart = new Chart(userCanvas, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: activeGraph === "user" ? "User Count" : "Post Count",
        data,
        borderColor: "#007bff",
        fill: false,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { maxRotation: 0, minRotation: 0 }
        }
      }
    }
  });
}

function updateGraphByTab(tab) {
  activeTab = tab;
  const dataSet = chartData[tab];
  if (!dataSet) return;

  const labels = dataSet.labels;
  const data = activeGraph === "user" ? dataSet.user : dataSet.post;
  createUserChart(labels, data);
}

document.querySelectorAll(".graph-tabs div").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".graph-tabs div").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    activeGraph = tab.textContent.includes("Post") ? "post" : "user";
    updateGraphByTab(activeTab);
  });
});

document.querySelectorAll(".top-nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".top-nav button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.dataset.tab;
    if (tab === "custom") {
      document.getElementById("custom-date-picker").style.display = "flex";
    } else {
      document.getElementById("custom-date-picker").style.display = "none";
      updateGraphByTab(tab);
    }
  });
});

let fromYear = null, toYear = null;

flatpickr("#fromDate", {
  dateFormat: "Y",
  onChange: function (selectedDates, dateStr) {
    fromYear = parseInt(dateStr);
    document.getElementById("toDate").disabled = false;
  }
});

flatpickr("#toDate", {
  dateFormat: "Y",
  onChange: function (selectedDates, dateStr) {
    toYear = parseInt(dateStr);
    if (fromYear && toYear && fromYear <= toYear) {
      updateChartByYearRange(fromYear, toYear);
    }
  }
});

function updateChartByYearRange(start, end) {
  const labels = [], data = [];
  for (let i = start; i <= end; i++) {
    labels.push(i.toString());
    data.push(Math.floor(Math.random() * 100));
  }
  createUserChart(labels, data);
}

updateGraphByTab(activeTab);

// ==========================
// CITIES BAR CHART SECTION
// ==========================
const citiesData = [
  { name: "Chennai", value: 100 }, { name: "Coimbatore", value: 98 },
  { name: "Salem", value: 96 }, { name: "Madurai", value: 93 },
  { name: "Trichy", value: 91 }, { name: "Tirunelveli", value: 89 },
  { name: "Vellore", value: 87 }, { name: "Dindigul", value: 85 },
  { name: "Thanjavur", value: 84 }, { name: "Kanchipuram", value: 83 },
  { name: "Karur", value: 80 }, { name: "Tiruppur", value: 79 },
  { name: "Erode", value: 78 }, { name: "Ariyalur", value: 77 },
  { name: "Theni", value: 75 }, { name: "Nagapattinam", value: 74 },
  { name: "Krishnagiri", value: 72 }, { name: "Dharmapuri", value: 71 },
  { name: "Sivaganga", value: 70 }, { name: "Pudukkottai", value: 68 },
  { name: "Cuddalore", value: 65 }, { name: "Ramanathapuram", value: 63 },
  { name: "Villupuram", value: 61 }, { name: "Perambalur", value: 60 },
  { name: "Tiruvarur", value: 58 }, { name: "Thoothukudi", value: 57 },
  { name: "Nilgiris", value: 55 }, { name: "Namakkal", value: 53 },
  { name: "Tiruvallur", value: 52 }, { name: "Virudhunagar", value: 50 },
  { name: "Ambur", value: 47 }, { name: "Kumbakonam", value: 45 }
];

const globalColors = [
  '#0078f2', '#0875eb', '#0d73e6', '#146ede', '#1a6bd6', '#2169cf', '#2666c9', '#2e63c2', '#365eba', '#3b5cb2',
  '#4259ad', '#4757a6', '#4f549e', '#574f96', '#5c4c91', '#634a8a', '#694782', '#70457a', '#754275', '#7d3d6e',
  '#853b66', '#8a385e', '#913659', '#963352', '#9e2e4a', '#a62b42', '#ab293d', '#b22636', '#b8242e', '#bf1f26',
  '#c41c21', '#cc1a1a'
];

const cityCtx = document.getElementById('citiesBarChart').getContext('2d');
let sortedCities = [...citiesData].sort((a, b) => a.name.localeCompare(b.name));
let currentPage = 1;
const itemsPerPage = 11;
let citiesChart;

function renderCitiesChart(page) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = sortedCities.slice(start, end);

  const labels = pageData.map(city => city.name);
  const values = pageData.map(city => city.value);
  const colors = pageData.map(city => {
    const globalIndex = citiesData.findIndex(c => c.name === city.name);
    return globalColors[globalIndex];
  });

  if (citiesChart) citiesChart.destroy();

  citiesChart = new Chart(cityCtx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Users',
        data: values,
        backgroundColor: colors,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      barThickness: 10,
      layout: { padding: { top: 10, bottom: 10 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: context => ` ${context.parsed.x}`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { stepSize: 5, precision: 0 },
          grid: { color: 'rgba(0,0,0,0.1)', borderDash: [5, 5] }
        },
        y: {
          ticks: { font: { size: 14 }, padding: 10 },
          grid: { display: false }
        }
      }
    }
  });

  document.getElementById("pageIndicator").textContent = `Page ${currentPage}`;
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = end >= sortedCities.length;
}

document.getElementById("sortSelector").addEventListener("change", (e) => {
  const sortType = e.target.value;

  if (sortType === "asc") {
    sortedCities = [...citiesData].sort((a, b) => a.value - b.value);
  } else if (sortType === "desc") {
    sortedCities = [...citiesData].sort((a, b) => b.value - a.value);
  } else {
    sortedCities = [...citiesData].sort((a, b) => a.name.localeCompare(b.name));
  }

  currentPage = 1;
  renderCitiesChart(currentPage);
});

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderCitiesChart(currentPage);
  }
});
document.getElementById("nextPage").addEventListener("click", () => {
  if ((currentPage * itemsPerPage) < sortedCities.length) {
    currentPage++;
    renderCitiesChart(currentPage);
  }
});

renderCitiesChart(currentPage);

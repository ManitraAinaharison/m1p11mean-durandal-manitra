/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        dark: "#14142a",
        "neutral-gray": "#f9fafc",
        "tumbleweed": "#eba37a",
      },
      textColor: {
        primary: "#14142a",
        secondary: "#7d7e91",
        danger: "",
        light: "#ffffff",
        "dark-gray": "#635959",
      },
      spacing: {
        1.5: "6px",
        2.5: "10px",
        4.5: "18px",
        7.5: "30px",
        12.5: "50px",
        14.5: "58px",
        17: "68px",
        25: "100px",
        27.5: "110px",
        30: "120px",
        32.5: "130px",
        42: "168px",
        45: "180px",
        50: "200px",
        80: "320px",
        86: "344px",
        106: "424px",
        125: "500px",
        164: "656px",
        180: "720px",
        300: "1200px",
        314: "1256px",
      },
      borderRadius: {
        button: "80px",
      },
    },
  },
  plugins: [],
};


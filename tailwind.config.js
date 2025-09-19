/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["RobotoRegular", "sans-serif"],
        "roboto-bold": ["RobotoBold", "sans-serif"],
        "roboto-serif": ["RobotoSerifRegular", "serif"],
        "roboto-serif-bold": ["RobotoSerifBold", "serif"],
      },
    },
  },
};

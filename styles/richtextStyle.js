// styles/richtextStyle.js

const richTextStyle = (color) => `
  a {
    text-decoration: none;
    color: ${color} !important;
  }

  h1 {
    font-size: 18 !important;
  }

  h2 {
    font-size: 16 !important;
  }

  input[type="checkbox"] {
    accent-color: ${color} !important;
  }
`;

export default richTextStyle;

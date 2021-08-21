const color = () => {
  const colors = [
    'aqua',
    'black',
    'blue',
    'brown',
    'red orange',
    'blue violet',
    'fuschia',
    'tan'
  ];
  return colors[Math.floor(Math.random() * colors.length)]
}

export default color;
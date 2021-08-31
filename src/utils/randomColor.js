const color = () => {
  const colors = [
    'red',
    'green',
    'purple',
    'orange',
    'blue'
  ];
  return colors[Math.floor(Math.random() * colors.length)]
}

export default color;
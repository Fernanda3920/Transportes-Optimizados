const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const days = Math.floor(hours / 24); // Calcular días si el tiempo excede 24 horas
    const remainingHours = hours % 24;
    const minutes = Math.floor((totalSeconds % 3600) / 60);
  
    if (days > 0) {
      return `${days} día(s), ${remainingHours} hora(s) y ${minutes} minuto(s)`;
    } else {
      return `${remainingHours} hora(s) y ${minutes} minuto(s)`;
    }
  };
  
  export default formatTime;
  
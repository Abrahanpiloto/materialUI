// console.log(import.meta.env.VITE_API_KEY);

import "./index.css";
import { LoadingButton } from "@mui/lab";
import { Container, Typography, Box, TextField } from "@mui/material";
import { useState } from "react";

const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=${
  import.meta.env.VITE_API_KEY
}&q=`;

export default function App() {
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    message: "",
  });

  //estado para pintar en la interfaz los datos del clima:
  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temp: "",
    humidity: "",
    condition: "",
    icon: "",
    conditionText: "",
    initialMessage: "Escribe una ciudad y aparecerá aquí su clima.",
  });
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ error: false, message: "" });
    try {
      if (!city.trim()) throw { message: "El campo ciudad esta vacio" };
      const response = await fetch(`${API_WEATHER}${city}`);
      const data = await response.json();
      console.log(data);
      if (data.error) throw { message: data.error.message };

      setWeather({
        city: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        humidity: data.current.humidity,
        condition: data.current.condition.code,
        icon: data.current.condition.icon,
        conditionText: data.current.condition.text,
        initialMessage: "", //limpia el msj inicial despues de obtener los datos
      });
      console.log(weather);
    } catch (error) {
      setError({ error: true, message: error.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="xs" sx={{ mt: 15 }}>
      <Typography
        variant="h2"
        fontWeight="bold"
        component="h1"
        align="center"
        gutterBottom
      >
        Weather App
      </Typography>
      <Box
        sx={{ display: "grid", gap: 2 }}
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          id="city"
          label="Ciudad"
          variant="outlined"
          size="small"
          required
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
          helperText={error.message}
          error={error.message}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          loadingIndicator="Searching..."
        >
          Search
        </LoadingButton>
      </Box>

      {/* Renderizado de quien aporta la data */}
      <Typography textAlign="center" sx={{ mt: 2, fontSize: "12px" }}>
        <Box component="span" sx={{ fontWeight: "bold", mb: 4 }}>
          Powered by:{" "}
        </Box>

        <a
          href="https://www.weatherapi.com/"
          title="Weather API"
          target="_blank"
        >
          WeatherAPI.com
        </a>
      </Typography>

      {/* Renderizado de los datos del clima */}
      {weather.initialMessage ? (
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          sx={{ marginTop: "25px" }}
        >
          {weather.initialMessage}
        </Typography>
      ) : (
        <Box
          sx={{
            mt: 8,
            display: "grid",
            gap: 2,
            textAlign: "center",
            backdropFilter: "blur(8px)", // Aplica el desenfoque
            border: "1px solid rgba(255, 255, 255, 0.18)", // Opcional: borde para mejorar la legibilidad
            borderRadius: "16px", // Opcional: bordes redondeados para una apariencia más suave
            padding: "16px", // Espacio interno para separar el contenido del borde
            width: "100%", // Ancho de la caja para centrarla y darle un poco de espacio alrededor
            margin: "30 auto", // Centrar la caja horizontalmente
            backgroundColor: "rgba(0, 0, 0, 0.3)", // Color de fondo semi-transparente
          }}
        >
          {/* Ciudad y Pais */}
          <Typography variant="h4" component="h2">
            {weather.city}, {weather.country}
          </Typography>
          <Box
            component="img"
            alt={weather.conditionText}
            src={weather.icon}
            sx={{ margin: "0 auto" }}
          />
          <Typography variant="h5" component="h3">
            {weather.temp} °C
          </Typography>
          <Typography variant="h5" component="h3">
            {" "}
            Humedad: {""}
            {weather.humidity} %
          </Typography>
          <Typography variant="h6" component="h4">
            {weather.conditionText}
          </Typography>
        </Box>
      )}
    </Container>
  );
}

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { ThemeProvider, createMuiTheme, CssBaseline, Typography, Box } from "@material-ui/core"
import { CSSProperties } from '@material-ui/core/styles/withStyles';

const LightTheme = createMuiTheme({
  palette: {
    type: "light"
  }
})

const DarkTheme = createMuiTheme({
  palette: {
    type: "dark"
  }
})

function reverse(s: string) {
  return s.split("").reverse().join("");
}

function mirror(text: string) {
  if (!text) return "";
  const sub = text.slice(0, -1);
  const last = text.slice(-1);
  const pal = sub + last + reverse(sub);
  return pal.toLowerCase();
}

export const App = () => {
  const [theme, setTheme] = useState(LightTheme)

  const input = useRef<HTMLInputElement>(null)
  const fake = useRef<HTMLElement>(null)

  const [text, setText] = useState("")
  const [bar, setBar] = useState(true);

  function onChange() {
    if (!input.current) return
    if (!fake.current) return
    const text = input.current.value
    setText(mirror(text))
  }

  function onClick(e: MouseEvent) {
    console.debug("clicked")
    if (!input.current) return
    if (!fake.current) return
    if (e.target === fake.current) return;
    input.current.focus();
  };

  useEffect(() => {
    if (!input.current) return
    if (!fake.current) return
    input.current.focus();
    document.body.addEventListener("click", onClick);
  }, [input.current, fake.current]);

  useEffect(() => {
    setInterval(() => {
      setBar((v) => !v);
    }, 500);
  }, []);

  const inputStyle: CSSProperties = {
    position: "absolute",
    left: "50%",
    transform: "translateY(-100px)",
  };

  const textStyle: CSSProperties = {
    width: "90vw",
    margin: "auto",
    wordBreak: "break-all",
    fontSize: "10vmin",
    fontFamily: "'Sniglet', sans-serif",
    textAlign: "center"
  }

  return (
    <ThemeProvider theme={theme}>
      <input
        style={inputStyle}
        onChange={onChange}
        ref={input} />
      <CssBaseline />
      <Box height="100vh" display="flex" >
        <Box height="20vh" />
        <Typography
          variant="h1"
          style={textStyle}
          children={text || (bar ? "|" : "")}
          ref={fake} />
      </Box>
    </ThemeProvider>
  );
}

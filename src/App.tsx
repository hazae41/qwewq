import React, { useMemo, useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { ThemeProvider, createMuiTheme, CssBaseline, Typography, Box, IconButton } from "@material-ui/core"
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { InvertColorsOutlined } from "@material-ui/icons"

const LightTheme = createMuiTheme({
  palette: {
    type: "light"
  }
})

const DarkTheme = createMuiTheme({
  palette: {
    type: "dark",
    background: { default: "#000000" }
  }
})

function mirror(text: string) {
  if (!text) return "";
  const sub = text.slice(0, -1);
  const last = text.slice(-1);
  const reverse = sub.split("").reverse().join("")
  const pal = sub + last + reverse;
  return pal.toLowerCase();
}

type State<T> = [T, Dispatch<SetStateAction<T>>]

function useStorage<T>(key: string, def: T): State<T> {
  const [state, setState] = useState(() => {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) as T : def
  })

  useEffect(() => {
    const item = JSON.stringify(state)
    localStorage.setItem(key, item)
  }, [key, state])

  return [state, setState]
}

export const App = () => {
  const [theme, setTheme] = useStorage("theme", "light")
  const switchTheme = () => setTheme(theme === "light" ? "dark" : "light")
  const _theme = useMemo(() => theme === "light" ? LightTheme : DarkTheme, [theme])

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

  useEffect(() => {
    if (!fake.current) return
    fake.current.scrollIntoView(false)
  }, [text])

  const inputStyle: CSSProperties = {
    position: "absolute",
    left: "50%",
    transform: "translateY(-100px)",
    opacity: 0
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
    <ThemeProvider theme={_theme}>
      <CssBaseline />
      <input
        style={inputStyle}
        onChange={onChange}
        ref={input} />
      <Box
        width="100vw"
        padding={2}
        position="fixed">
        <IconButton
          onClick={switchTheme}
          children={<InvertColorsOutlined />} />
      </Box>
      <Box height="100vh">
        <Box height="20vh" />
        <Typography
          variant="h1"
          style={textStyle}
          children={text || (bar ? "|" : "")}
          ref={fake} />
        <Box height="20vh" />
      </Box>
    </ThemeProvider>
  );
}

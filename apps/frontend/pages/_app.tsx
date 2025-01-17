import { UserProvider } from "@auth0/nextjs-auth0"
import { StyledEngineProvider, useMediaQuery } from "@material-ui/core"
import { createTheme, ThemeProvider } from "@material-ui/core/styles"
import AdapterDateFns from "@material-ui/lab/AdapterDateFns"
import LocalizationProvider from "@material-ui/lab/LocalizationProvider"
import { StylesProvider } from "@material-ui/styles"
import { useRouter } from "next/router"
import NProgress from "nprogress"
import React, { useEffect } from "react"

import GlobalStyle from "@/GlobalStyle"
import { LiveFetchContext, LiveServiceContext } from "@/context"

import "nprogress/nprogress.css"

function MyApp({ Component, pageProps }: any) {
  // You can optionally pass the `user` prop from pages that require server-side
  // rendering to prepopulate the `useUser` hook.
  const { user } = pageProps

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")

  const theme = React.useMemo(
    () =>
      createTheme({
        // TODO
        // palette: {
        //   mode: prefersDarkMode ? "dark" : "light",
        // },
      }),
    [prefersDarkMode]
  )

  const router = useRouter()

  useEffect(() => {
    const routeChangeStart = () => NProgress.start()
    const routeChangeComplete = () => NProgress.done()

    router.events.on("routeChangeStart", routeChangeStart)
    router.events.on("routeChangeComplete", routeChangeComplete)
    router.events.on("routeChangeError", routeChangeComplete)
    return () => {
      router.events.off("routeChangeStart", routeChangeStart)
      router.events.off("routeChangeComplete", routeChangeComplete)
      router.events.off("routeChangeError", routeChangeComplete)
    }
  }, [])

  return (
    <StyledEngineProvider injectFirst>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <UserProvider user={user}>
              <LiveServiceContext>
                <LiveFetchContext>
                  <GlobalStyle />
                  <Component {...pageProps} />
                </LiveFetchContext>
              </LiveServiceContext>
            </UserProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </StylesProvider>
    </StyledEngineProvider>
  )
}

export default MyApp

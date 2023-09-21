import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "./Components/Layout";
import { ThemeProvider } from "@mui/material/styles";
import { AppContextProvider } from "./Components/AppContext";
import { ReactFlowProvider } from "reactflow";
// import Theme from "./Components/Theme";

export default function App({ Component, pageProps }: any) {
  // Use the layout defined at the page level, if available
  if (Component.getLayout) {
    const getLayout = Component.getLayout || ((page: any) => page);
    return getLayout(<Component {...pageProps} />);
  } else {
    return (
      // <ThemeProvider theme={Theme}>
      <AppContextProvider>
        <ReactFlowProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        </ReactFlowProvider>
      </AppContextProvider>
      // </ThemeProvider>
    );
  }
}

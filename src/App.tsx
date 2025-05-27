import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import ThreeScene from "./components/ThreeScene";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div class="app">
        <ThreeScene />
      </div>
    </QueryClientProvider>
  );
}

export default App;

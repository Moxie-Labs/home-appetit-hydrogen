import DebugPage from "../components/DebugPage.client";

export default function Index({response}) {

  const SHOW_DEBUG = import.meta.env.VITE_SHOW_DEBUG === undefined ? false : import.meta.env.VITE_SHOW_DEBUG === "true";

  if (!SHOW_DEBUG) return response.redirect('/');

  return (
    <div>
      <DebugPage/>
    </div>
  );
}

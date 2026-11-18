declare module "@vaultui/icons-mcp/worker" {
  interface IconsMcpEnv {
    ASSETS: {
      fetch(input: Request | string | URL): Promise<Response>;
    };
  }

  const worker: {
    fetch(request: Request, env: IconsMcpEnv): Promise<Response>;
  };

  export default worker;
}

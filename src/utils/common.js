export const transformActions = (actions) => {
  return actions.map((action) => ({
    type: "FunctionCall",
    params: {
      methodName: action.functionCall.methodName,
      args: action.functionCall.args,
      gas: action.functionCall.gas,
      deposit: action.functionCall.deposit,
    },
  }));
};

export async function getViaApiServer({ keys }) {
  const args = {
    keys,
  };

  return await (
    await fetch("https://api.near.social/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
    })
  ).json();
}

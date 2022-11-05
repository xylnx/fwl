const auth = (function () {
  const login = async () => {
    const user = model.state.user;
    const pwd = model.state.password;
    // console.log({ user }, { pwd });

    try {
      const response = await fetch(model.API.authUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ user, pwd }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          if (model.state.authToken === null) {
            throw new Error('login failed');
          }
          return await auth.refresh();
        }
        throw new Error(`${response.status} ${response.statusText}`);
      }
      // Response contains the token
      return await response.json();
    } catch (error) {
      console.log(error.stack);
      // displayError();
    }
  };

  const refresh = async () => {
    console.log(2);

    const response = await fetch(model.API.refreshUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    // Server responds, but
    if (!response.ok) {
      // Status is `unauthorized` or `forbidden`
      if (response.status === 401 || response.status == 403) {
        // Show login view
        throw new Error('refresh failed');
      }
      throw new Error(`+++++ ${response.status} ${response.statusText}`);
    }

    // Response contains the token
    const responseJson = await response.json();
    const token = responseJson.accessToken;
    model.state.update({ authToken: token });
    console.log(error.stack);
    // displayError();
  };

  const logout = async () => {
    const response = await fetch(model.API.logoutUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
  };

  return {
    login,
    refresh,
    logout,
  };
})();

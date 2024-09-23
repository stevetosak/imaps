export default class IMapsNetUtil {
  constructor() {
    this.backendUrl = "http://localhost:8080";
    this.token = localStorage.getItem("token");
  }

  async sendMapRenderRequest(container,shapes) {

    if (!this.validToken) return;

    let stageJson = {
      attrs: {
        width: container.clientWidth,
        height: container.clientHeight,
      },
      className: "Stage",
      Layer: [
        {
          attrs: {},
          className: "Layer",
          children: [],
        },
      ],
    };

    stageJson.Layer[0].children.push(shapes);


   let response  = fetch(`${this.backendUrl}/api/protected/render`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(stageJson),
    })
      .then((response) => response.json())
      .catch((error) => console.log(error))


      return await response;
  }

  validToken() {
    if (this.token == null) {
      console.log("user not auth, token null");
      return false;
    }

    return true;
  }

  async sendMapLoadRequest() {
    //if (!this.validToken) return;

      let response = await fetch(`${this.backendUrl}/api/protected/mapData`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });

      let data = await response.json()
      console.log("JSON DATA: ", data);

    return data;
  }
}

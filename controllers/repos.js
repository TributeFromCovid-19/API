const config = require("../config");
const ghGot = require("gh-got");
const pages = require("./pages");

const repoInfo = async function (repoName) {
  const url = `/repos/InMemoryCovid19/${repoName}`;
  try {
    const response = await ghGot(url, { token: config.github_token });
    return response.body;
  } catch (error) {
    console.log("repoInfo", error.statusCode);
  }
};

exports.createRepo = async function () {
  const newRepoName = `gh-pages-${Date.now()}`;
  const url = "/repos/InMemoryCovid19/StartHere/generate";
  const body = {
    owner: "InMemoryCovid19",
    name: `${newRepoName}`,
    description: "This is your first repository",
    private: false,
  };

  try {
    const response = await ghGot.post(url, {
      headers: {
        Accept: "application/vnd.github.baptiste-preview+json",
      },
      body: body,
      responseType: "json",
      token: config.github_token,
    });
    //Check repo is accessible by API
    let repoInfoRes = await repoInfo(`${newRepoName}`);
    // populate repo???
    // enable pages
    if (repoInfoRes && repoInfoRes.updated_at !== undefined) {
      try {
        const report = await pages.enablePages(`${newRepoName}`);

        return report;
      } catch (error) {
        console.log("createRepo pages", error.response.statusCode, error.response.messages);
        console.log("createRepo pages .response.body", error.response.body);
      }
    }
  } catch (error) {
    console.log("createRepo", error, error.statusCode);
    console.log("createRepo.response.body", error.response.body);
  }
};
async function getUIDUserGroup() {
  const uids = [];
  let interval = null;

  interval = setInterval(() => {
    const elements = document.querySelectorAll(
      'div[role="listitem"][data-visualcompletion="ignore-dynamic"]'
    );

    if (elements.length === 0) {
      clearInterval(interval);
      console.log(uids);
    }

    elements.forEach((element) => {
      const innerHtml = element.innerHTML;
      const regexPattern = /\/groups\/(\d+)\/user\/(\d+)\//;
      const match = innerHtml.match(regexPattern);
      if (match) {
        const groupId = match[1];
        const userId = match[2];
        console.log(`groupId: ${groupId}, userId: ${userId}`);
        uids.push(userId);
        // Thực hiện các thao tác khác với groupId và userId ở đây
        // Xóa div sau khi đã lấy được dữ liệu
        element.remove();
      }
    });
  }, 1000);
}

async function getUIDFriends() {
  const getProfileByLink = (link) => {
    return new Promise((resolve, reject) => {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(link, requestOptions)
        .then((response) => response.text())
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  };
  const uids = [];
  const elements = document.querySelectorAll(
    'div[data-visualcompletion="ignore-dynamic"][style="padding-left: 8px; padding-right: 8px;"]'
  );
  elements.forEach(async (element, key) => {
    if (key > 0) return;
    const innerHtml = element.innerHTML;
    const regexPattern = /href="https:\/\/www\.facebook\.com\/([^\/?"]+)/;
    const match = innerHtml.match(regexPattern);
    if (match) {
      let userId = match[1];
      if (userId === "profile.php") {
        const regexGetUid =
          /href="https:\/\/www\.facebook\.com\/(?:[^\/?"]*\/)?(?:profile\.php\?id=)?(\d+)/;
        const matchUid = innerHtml.match(regexGetUid);
        if (matchUid) {
          userId = matchUid[1];
        }
      } else {
        const profileHmtl = await getProfileByLink(
          `https://www.facebook.com/${userId}`
        );

        // Regex pattern để tìm đoạn mã JSON trong chuỗi HTML và lấy userID
        const regexString = `"userVanity"\\s*:\\s*"${userId}",\\s*.*?"userID"\\s*:\\s*"(\\d+)"`;
        const regexProfile = new RegExp(regexString, "s");
        // Sử dụng regex để tìm và trích xuất userID từ chuỗi HTML
        const matchProfile = profileHmtl.match(regexProfile);
        if (matchProfile) {
          userId = matchProfile[1];
        }
      }

      if (userId) {
        uids.push(userId);
      }
    }
  });
}

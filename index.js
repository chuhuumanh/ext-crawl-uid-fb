async function getUserGroup() {
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

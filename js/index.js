$(document).ready(function () {
  function resetCard($card) {
    $card.data("ws", null);
    $card.find(".light").removeClass("connect");
    $card.find(".submit").text("Connect");
    $card.find(".close").addClass("disable");
    $card.find("input, select").val("");
  }
  $(".card").each(function () {
    $(this).data("ws", null);
    $(this).data("session", null);
  });

  $(".card").on("click", ".submit", function (e) {
    e.preventDefault();

    const $card = $(this).closest(".card");
    let ws = $card.data("ws");
    let session = $card.data("session");

    const deviceData = {
      brand: $card.find(".brand").val(),
      model: $card.find(".model").val(),
      sv: $card.find(".sv").val(),
      tv: $card.find(".sn").val(),
    };

    const deviceStatus = {
      status: $card.find(".status").val(),
      session_id: session,
    };

    // ===== CONNECT =====
    if (!ws) {
      ws = new WebSocket("ws://localhost:8000");
      $card.data("ws", ws);

      ws.onopen = () => {
        $card.find(".light").addClass("connect");
        $card.find(".submit").text("Send");
        $card.find(".close").removeClass("disable");

        $card
          .find(".console-content")
          .append(
            `<li class="send-message">Connect & Send: ${JSON.stringify(
              deviceData,
              null,
              2
            )}</li>`
          );
        ws.send(JSON.stringify(deviceData));
      };

      ws.onmessage = (e) => {
        const obj = JSON.parse(e.data);
        session = obj.session_id;
        $card.data("session", session);
        console.log("onmessage", obj);
        $card
          .find(".console-content")
          .append(
            `<li class="response-message">Response: ${JSON.stringify(
              obj,
              null,
              2
            )}</li>`
          );
      };

      ws.onclose = () => {
        $card.find(".console-content").append(`<li>Connection closed</li>`);
        resetCard($card);
      };

      ws.onerror = (err) => {
        console.error(err);
      };

      return;
    }

    // ===== SEND =====
    ws.send(JSON.stringify(deviceStatus));
    $card
      .find(".console-content")
      .append(
        `<li class="send-message">Send: ${JSON.stringify(
          deviceStatus,
          null,
          2
        )}</li>`
      );
  });

  // ===== CLOSE =====
  $(".card").on("click", ".close", function () {
    const $card = $(this).closest(".card");
    const ws = $card.data("ws");

    if (!ws || $(this).hasClass("disable")) return;

    resetCard($card);
    ws.send(JSON.stringify({ status: "cancel" }));
    ws.close();
  });
});

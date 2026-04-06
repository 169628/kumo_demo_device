$(document).ready(function () {
  const BASE_URL = "http://localhost:8080/kumo/api";

  function resetCard($card) {
    $card.data("ws", null);
    $card.find(".light").removeClass("connect");
    $card.find(".brand").prop("disabled", false);
    $card.find(".model").prop("disabled", false);
    $card.find(".sn").prop("disabled", false);
    $card.find(".submit").text("Connect");
    $card.find(".close").addClass("disable");
    $card.find("input, select").val("");
  }
  $(".card").each(function () {
    $(this).data("socket", null);
    $(this).data("stompClient", null);
    $(this).data("session", null);
  });

  // ===== BUTTON CONNECT & SEND =====
  $(".card").on("click", ".submit", function (e) {
    e.preventDefault();

    const $card = $(this).closest(".card");
    let socket = $card.data("socket");
    let stompClient = $card.data("stompClient");
    let session = $card.data("session");

    $card.find(".brand").prop("disabled", true);
    $card.find(".model").prop("disabled", true);
    $card.find(".sn").prop("disabled", true);

    const deviceData = {
      session,
      brand: $card.find(".brand").val(),
      model: $card.find(".model").val(),
      sv: $card.find(".sv").val(),
      sn: $card.find(".sn").val(),
      status: $card.find(".status").val(),
    };

    // ===== FIRST CONNECT =====
    if (!socket) {
      socket = new SockJS(BASE_URL + "/endpoint");
      $card.data("socket", socket);

      stompClient = Stomp.over(socket);
      $card.data("stompClient", stompClient);

      stompClient.connect({ "content-type": "application/json" }, () => {
        $card.find(".light").addClass("connect");
        $card.find(".submit").text("Send");
        $card.find(".close").removeClass("disable");

        stompClient.subscribe("/msg/" + deviceData.sn, (message) => {
          const obj = JSON.parse(message.body);
          const { session } = obj;
          $card.data("session", session);
          $card
            .find(".console-content")
            .append(
              `<li class="response-message">Response: ${JSON.stringify(
                obj,
                null,
                2,
              )}</li>`,
            );
        });

        $card
          .find(".console-content")
          .append(
            `<li class="send-message">Connect & Send: ${JSON.stringify(
              deviceData,
              null,
              2,
            )}</li>`,
          );

        stompClient.send(
          "/connect/device/" + deviceData.sn,
          { "content-type": "application/json" },
          JSON.stringify(deviceData),
        );
      });

      return;
    }

    // ===== SEND STATUS =====
    $card
      .find(".console-content")
      .append(
        `<li class="send-message">Send: ${JSON.stringify(
          deviceData,
          null,
          2,
        )}</li>`,
      );

    stompClient.send(
      "/connect/device/" + deviceData.sn,
      { "content-type": "application/json" },
      JSON.stringify(deviceData),
    );
  });

  // ===== BUTTON CLOSE CONNECT =====
  $(".card").on("click", ".close", function () {
    const $card = $(this).closest(".card");
    const stompClient = $card.data("stompClient");

    if (!stompClient || $(this).hasClass("disable")) return;

    stompClient.disconnect(() => {
      $card.data("socket", null);
      $card.data("stompClient", null);
      $card.data("session", null);
      resetCard($card);
    });
  });
});

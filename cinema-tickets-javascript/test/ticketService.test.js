import { jest } from "@jest/globals";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";
import TicketService from "../src/pairtest/TicketService";
import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService";
import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService";

describe("TicketService tests", () => {
  test("should calculate the correct total cost", () => {
    const adultTicketReq = new TicketTypeRequest("ADULT", 3);
    const childTicketReq = new TicketTypeRequest("CHILD", 6);
    const ticketService = new TicketService();

    expect(
      ticketService.purchaseTickets(1, adultTicketReq, childTicketReq)
    ).toBe("total cost: £120");
  });
  test("should calculate the correct total of ticket cost and pass that to the makePayment method", () => {
    const adultTicketReq = new TicketTypeRequest("ADULT", 5);
    const childTicketReq = new TicketTypeRequest("CHILD", 2);
    const ticketService = new TicketService();
    const costSpyOn = jest.spyOn(TicketPaymentService.prototype, "makePayment");
    ticketService.purchaseTickets(1, adultTicketReq, childTicketReq);

    expect(costSpyOn).toBeCalledWith(1, 120);

    jest.clearAllMocks();
  });
  test("should calculate the correct total of seats and pass that to the reserveSeat method", () => {
    const adultTicketReq = new TicketTypeRequest("ADULT", 3);
    const childTicketReq = new TicketTypeRequest("CHILD", 6);
    const ticketService = new TicketService();
    const seatSpyOn = jest.spyOn(
      SeatReservationService.prototype,
      "reserveSeat"
    );
    ticketService.purchaseTickets(1, adultTicketReq, childTicketReq);

    expect(seatSpyOn).toBeCalledWith(1, 9);

    jest.clearAllMocks();
  });
});

describe("TicketService Error tests", () => {
  test("should cause an error if more than 20 tickets are being purchased", () => {
    const adultTicketReq = new TicketTypeRequest("ADULT", 12);
    const childTicketReq = new TicketTypeRequest("CHILD", 6);
    const infantTicketReq = new TicketTypeRequest("INFANT", 4);
    const ticketService = new TicketService();

    const result = ticketService.purchaseTickets(
      1,
      adultTicketReq,
      childTicketReq,
      infantTicketReq
    );

    expect(result).toBe("You may only purchase up to 20 tickets");
  });
  test("should cause an error when purchasing child/infant tickets without an adult", () => {
    const childTicketReq = new TicketTypeRequest("CHILD", 6);
    const infantTicketReq = new TicketTypeRequest("INFANT", 4);
    const ticketService = new TicketService();

    const result = ticketService.purchaseTickets(
      1,
      childTicketReq,
      infantTicketReq
    );

    expect(result).toBe("At least one adult ticket must be purchased");
  });
  test("should cause an error when accountId is the wrong data type", () => {
    const childTicketReq = new TicketTypeRequest("CHILD", 6);
    const infantTicketReq = new TicketTypeRequest("INFANT", 4);
    const ticketService = new TicketService();

    const result = ticketService.purchaseTickets(
      "1",
      childTicketReq,
      infantTicketReq
    );

    expect(result).toBe("accountId must be a valid number");
  });
});

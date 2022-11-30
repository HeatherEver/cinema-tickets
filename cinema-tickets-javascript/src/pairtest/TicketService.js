import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    if (typeof accountId !== "number") {
      return "accountId must be a valid number";
    }
    let adultTickets = 0;
    let childTickets = 0;
    let infantTickets = 0;
    let totalTickets = 0;
    let totalCost = 0;
    let under18s = 0;
    let totalSeats = 0;

    ticketTypeRequests.forEach((request) => {
      if (request.getTicketType() === "ADULT") {
        adultTickets += request.getNoOfTickets();
      }
      if (request.getTicketType() === "CHILD") {
        childTickets += request.getNoOfTickets();
      }
      if (request.getTicketType() === "INFANT") {
        infantTickets += request.getNoOfTickets();
      }
    });

    under18s = childTickets + infantTickets;
    totalTickets = adultTickets + childTickets + infantTickets;
    totalCost = adultTickets * 20 + childTickets * 10;
    totalSeats = adultTickets + childTickets;

    if (totalTickets > 20) {
      return "You may only purchase up to 20 tickets";
    }

    if (!adultTickets && under18s > 0) {
      return "At least one adult ticket must be purchased";
    }

    new TicketPaymentService().makePayment(accountId, totalCost);
    new SeatReservationService().reserveSeat(accountId, totalSeats);

    return `total cost: £${totalCost}`;
  }
}

// INFANT £0
// CHILD £10
// ADULT £20
// purchaser declares how many and what type of tickets
// multiple can be purchased
// maximum of 20 tickets at one time
// infants don't pay and don't have a seat
// child and infant cannot be purchased alone

// calculate the correct amount owed
// make payment request to TicketPaymentService
// reject any invalid ticket purchase. (more than 20, child/infant without adult, incorrect data type)

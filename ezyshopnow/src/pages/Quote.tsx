import quote from "../assets/quote.png"

function Quote() {
  return (
    <div className="quote-container">
      <img src={quote} alt="Quote" className="quote-image" />
    </div>
  );
}
export default Quote;
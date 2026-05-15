import { useState, React } from 'react'

const Allcourses = () => {
    const [expandedCards, setExpandedCards] = useState({});
  
    const toggleExpand = (index) => {
      setExpandedCards((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    };
 const courses = [
    {
      name: "Learner Course",
      price: " 1770",
      subcription: "One Month",
   
      points: "1500",
      features: [
        "Basic Crypto Knowledge",
        "Basic Buy/Sell On Centralised Exchange",
        "Crypto Sip Guide",
        "Portfolio Management Guide",
        "One Month Spot Call",
        "Basic Fundamental Analysis, Technical Analysis",
        "Online Education Videos",
      ],
    },
    {
      name: "Master Course",
      price: " 3540",
      subcription: "Three Months",
     
      points: "3000",
      features: [
        "Advance Crypto Knowledge",
        "Pro Buy/Sell On Centralized Exchange",
        "Advance Crypto SIP Guide",
        "Advance Portfolio Management",
        "Spot & Future Trading Call (2 Months)",
        "Advance Fundamental Analysis, Technical Analysis",
        "Online Education Videos",
        "Regular PNL Strategy",
        "Basic Liquidation Strategy",
      ],
    },
    {
      name: "Pro Master Course",
      price: " 7080",
      subcription: "Six Months",
      
      points: "6000",
      features: [
        "A To Z Advance Crypto Knowledge",

        "Pro Buy/Sell On Centralized Exchange",

        "Advance Crypto SIP Guide",

        "Advance Portfolio Management",

        "Spot & Future Trading Call (4 Months)",

        "Advance Fundamental Analysis, Technical Analysis",

        "Online Education Videos",

        "Risk Management Strategy",
        "Regular PNL Strategy",

        "Basic Liquidation Strategy",

        "Gem Coin Finding Technique",

        "Premium Future Trading Strategy",

        "Premium Portfolio Management Strategy",

        "Five Long-Term Holding Coins Name",

        "Trading Fund Management Strategy",

        "A To Z Advance Fundamental Analysis, Technical Analysis",
      ],
    },
    {
      name: "Teacher Course",
      price: " 11800 ",
      points: "10000",
      
      features: [
        "A To Z Advance Crypto Knowledge",

        "Pro Buy/Sell On Centralized Exchange",

        "Advance Crypto SIP Guide",

        "Advance Portfolio Management",

        "Spot & Future Trading Call (6 Months)",

        "Advance Fundamental Analysis, Technical Analysis",

        "Online Education Videos",

        "Risk Management Strategy",

        "Regular PNL Strategy",

        "Basic Liquidation Strategy",
        "Gem Coin Finding Strategy",
        "Premium Future Trading Strategy",

        "Premium Portfolio Management Strategy",

        "Five Long-Term Holding Coins Name",

        "Trading Fund Management Strategy",

        "A To Z Advance Fundamental Analysis, Technical Analysis",

        "Whales Wallet Tracking",

        "Crypto Taxation",

        "Crypto Rules & Knowledge",

        "DEX & CEX Arbitrage Model",
      ],
    },
    {
      name: "Pro Teacher Course",
      price: " 59000",
      points: "25000",
     
      features: [
        "Advance Crypto SIP Guide",
"Advance Portfolio Management",
"Spot & Future Trading Call (12 Months)",
"Advance Fundamental Analysis, Technical Analysis",
"Online Education Videos",
"Risk Management Strategy",
"Regular PNL Strategy",
"Basic Liquidation Strategy",
"Gem Coin Finding Strategy",
"Premium Future Trading Strategy",
"Premium Portfolio Management Strategy",
"Five Long-Term Holding Coins Name",
"Trading Fund Management Strategy",
"A To Z Advance Fundamental Analysis, Technical Analysis",
"Whales Wallet Tracking",
"Crypto Taxation",
"Crypto Rules & Knowledge",
"Dex & Cex Arbitrage Model",
"Monthly 2% Scholarship"
      ],
    },
    {
      name: "Monthly Subscription",
      price: " 944",
      points: "800",
      paymentUrl: "https://rzp.io/rzp/yx0C4LX",
      gold: true,
      features: [
        "Monthly Trading Guidance",
        "Monthly Special Classes",
        "Expert Advice",
        "Two Coin Suggestion",
        "One Special Call",
        "Trade Call Signals(1 Month)"
      ],
    },
     {
      name: "Premium Monthly Subscription",
      price: "1880",
      points: "1600",
      paymentUrl: "https://rzp.io/rzp/yx0C4LX",
      gold: true,
      features: [
        "Monthly  Special Trading Guidance",
        "Monthly Special Classes",
        "Special Expert Advice",
        "four Coin Suggestion",
        "One Special Call",
        "Trade Call Signals(1 Month)",
      ],
    },
    {
      name: "Super Premium Monthly Subscription",
      price: "2950",
      points: "2500",
      paymentUrl: "https://rzp.io/rzp/yx0C4LX",
      gold: true,
      features: [
        "Monthly  Special Trading Guidance",
        "Monthly Special Classes",
        "Special Expert Advice",
        "Six Coin Suggestion",
        "One Special Call",
        "Trade Call Signals(1 Month)",
      ],
    },
  ];

  return (
   
    <>
      <div className="container py-5 ">
      <div className="row justify-content-start">
      {courses.map((course, index) => {
          const isExpanded = expandedCards[index];
          const visibleFeatures = isExpanded
            ? course.features
            : course.features.slice(0, 8); //
         {/* {courses.map((course, index) => ( */}
        return(
         <div key={index} className="col-md-3 my-1">
            <div className="card p-3 mt-3 w-100 h-100 rounded-3 cardpackage">
              <div className="card-body d-flex flex-column">
                <div className="text-center">
                  <h3
                    className="fw-bold"
                    style={{ color: course.gold ? "gold" : "inherit" }}
                  >
                    {course.name}
                  </h3>
                  <div className="fw-bold h5 mt-2">
                    RS.{course.price}/- (Incl. GST)
                  </div>
                  <div className="fw-bold h5 mt-2" style={{ color: "gold" }}>
                    🌟{course.points} Points
                  </div>
                </div>
            <div className="flex-grow-1 mt-3">
                    {visibleFeatures.map((f, i) => (
                      <div key={i} className="d-flex mt-2">
                        <div>🌟</div>
                        <div className="ms-2">{f}</div>
                      </div>
                    ))}

                    {course.features.length > 8 && (
                      <button
                        className="btn btn-link p-0 mt-2 text-primary text-decoration-none"
                        style={{ fontWeight: "500" }}
                        onClick={() => toggleExpand(index)}
                      >
                        {isExpanded ? "See Less ▲" : "See More ▼"}
                      </button>
                    )}
                  </div>
              
              </div>

             
            </div>
          </div> 
        );
      })}
     

            </div>
    </div>
    </>
  )
}

export default Allcourses

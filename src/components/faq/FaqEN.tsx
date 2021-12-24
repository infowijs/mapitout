import React from "react";

import { StyledContentSegment } from "./styles";

export const FaqEN = ({ setDemoVisibility }: any) => (
  <>
    <StyledContentSegment>
      <h1>What is the MapitOut tool?</h1>
      <p>
        The MapitOut tool is an interactive map that allows you to select a
        location to live in by entering desired travel times to different
        locations. You can find out more about the various parts of the
        Amsterdam Area on the{" "}
        <a
          href="https://www.iamsterdam.com/en/living/about-living-in-amsterdam/living-in-the-amsterdam-area"
          target="_blank"
          rel="noopener noreferrer"
        >
          ‘Living in the Amsterdam Area’ section of the I amsterdam website
        </a>
        . Internationals who have come to work in the Amsterdam Area can find
        reliable information about what makes the region unique, including
        videos and testimonials of people living there.
      </p>
      <p>
        Please note that the tool is not intended for planning travel in
        real-time. Refer to real-time travel platforms such as{" "}
        <a href="https://9292.nl/en" target="_blank" rel="noopener noreferrer">
          www.9292.nl/en
        </a>{" "}
        (public transport information) and{" "}
        <a
          href="https://maps.google.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Maps
        </a>
        .{" "}
      </p>
    </StyledContentSegment>
    <StyledContentSegment>
      <h1>Who is the tool for?</h1>
      <p>
        Anyone interested in learning more about travel times in the Netherlands
        can use the MapitOut tool! It was designed in English to help
        internationals who have come to work in the Amsterdam Area, but now also
        has a Dutch version. Furthermore it uses many symbols and visual
        elements.
      </p>
    </StyledContentSegment>
    <StyledContentSegment>
      <h1>How does the tool work?</h1>
      <p>
        Say you would want to travel for up to half an hour to your workplace by
        taking public transport, while at the same time being no further than 15
        minutes from your children’s school by bike – MapitOut will then show
        you the overlapping area. This overlapping area shows potential living
        areas which meet both travel time criteria. You can continue to add more
        locations, such as your partner’s workplace or a friend’s home.{" "}
        <span className="link" onClick={() => setDemoVisibility(true)}>
          Watch the MapitOut tutorial video to see it in action
        </span>
        .
      </p>
    </StyledContentSegment>
    <StyledContentSegment>
      <h1>How can I access the tool?</h1>
      <p>
        The MapitOut tool can be accessed through the ‘Living in the Amsterdam
        Area’ page mentioned above or directly at{" "}
        <a
          href="https://mapitout.iamsterdam.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://mapitout.iamsterdam.com
        </a>
        .
      </p>
    </StyledContentSegment>
    <StyledContentSegment>
      <h1>What should I do if the tool isn’t working?</h1>
      <p>
        Oh no! First, try refreshing the url or try another browser (e.g.
        Firefox or Chrome). When searching for a location you can enter an
        establishment or an address, if so please put a comma between the street
        address and the city. Always click on the appropriate dropdown
        suggestion. If you still have issues, contact us by email:{" "}
        <a href="mailto:welcome@amsterdam.nl">welcome@amsterdam.nl</a>{" "}
        mentioning you have a question/remark regarding the MapitOut tool. Feel
        free to include print screens and details of your browser.
      </p>
    </StyledContentSegment>
    <StyledContentSegment>
      <h1>Which travel information does it use?</h1>
      <p>
        Travel times are calculated using various data sources.
        Google Maps is used to create the base level map to show where paths, roads and stations are located.
        Public transport timetable data is then layered on top including agencies such as GVB, FlixBus, NS, R-Net and more.
        Driving, cycling and walking time models are developed by TravelTime platform, derived from OpenStreetMaps.{" "}
        <a
          href="https://www.traveltimeplatform.com/turn-radius-maps-into-travel-time"
          target="_blank"
          rel="noopener noreferrer"
        >
          Find more information about TravelTime.
        </a>
      </p>
    </StyledContentSegment>
    <StyledContentSegment>
      <h1>
        How is the reach of a cycling and public transport search determined?
      </h1>
      <p>
        The tool assumes the user can cycle at the start of each journey, and
        that residents can cycle for up to 10 minutes to reach their first
        public transport connection. It also allows five minutes for the cyclist
        to park their bike. It also assumes users are willing to walk to an
        initial transport mode (if quicker) and walk to transfer between modes.
      </p>
      <p>
        Once the traveller takes a mode of public transport, such as a train,
        the tool assumes travel continues via public transport for the remainder
        of the journey. The only exception to this is ferries because residents
        often take bikes with them on this mode.
      </p>
      <p>Some example journeys within 30 minutes</p>
      <ul>
        <li>
          Cycle 8 minutes + park 5 minutes + walk 5 minutes + metro 12 minutes
          (30 minutes)
        </li>
        <li>
          Cycle 10 minutes, park 5 minutes + train 15 minutes (30 minutes)
        </li>
        <li>
          Walk 12 minutes (12 minutes – still reachable in under 30 minutes)
        </li>
      </ul>
    </StyledContentSegment>
    <StyledContentSegment>
      <h1>I would like to offer this tool as well, is that possible?</h1>
      <p>
        That is great, maybe we can help. You can always refer to the MapitOut
        tool. However, you might want to apply the functionality of the tool to
        your own website. The application is built as open-source, which means
        you can fork the tool. To make the tool work like the MapitOut tool, you
        do need to close separate data contracts (e.g. the TravelTime platform).
        You can find the information required on{" "}
        <a
          href="https://github.com/infowijs/mapitout"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
        .
      </p>
    </StyledContentSegment>
    <StyledContentSegment>
      <h1>A few disclaimers</h1>
      <ul>
        <li>
          Pinpoints on the map. Due to pinpoints placed on the map by Google
          which can be further than in reality, your search result could be
          different than expected. One solution could be that if you get
          multiple suggestions for e.g. a station (or other location), you try
          several and see if that changes the result.
        </li>
        <li>
          Please note that the tool is not a real-time travel tool. The tool
          shows results (ranges) assuming the public transport journey takes
          place anytime between a timeslot of two hours during the day but does
          not take into account the exact time you wish to travel. It could be
          that the actual travel will take longer, or there is no public
          transport at a certain time, or you will have to wait longer for a
          train. Please refer to real-time travel platforms to make sure you can
          reach your destination (e.g.{" "}
          <a
            href="https://9292.nl/en"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.9292.nl/en
          </a>
          ).
        </li>
        <li>
          The shape of the ranges (results of your searches) is adjusted with a
          processing layer. This means the amount of points have been reduced
          for better performance of the application. The remaining points are
          smoothed based on the current zoom level.
        </li>
      </ul>
    </StyledContentSegment>
    <StyledContentSegment>
      <h1>Questions?</h1>
      <p>
        For any questions or suggestions please contact{" "}
        <a
          href="mailto:welcome@amsterdam.nl"
          target="_blank"
          rel="noopener noreferrer"
        >
          welcome@amsterdam.nl
        </a>
        .
      </p>
    </StyledContentSegment>
  </>
);

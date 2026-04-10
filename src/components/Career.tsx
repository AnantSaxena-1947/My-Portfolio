import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Software Development Engineer</h4>
                <h5>Volkswagen Group Digital Solutions</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Engineered microservices architecture using Go, Kotlin & Spring Boot designed to handle 50K+ daily orders. Architected AWS infrastructure leveraging ECS, Lambda, RDS, reducing costs by 25%.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>UI Developer</h4>
                <h5>Medtechsecure, Pune</h5>
              </div>
              <h3>2023 - 2024</h3>
            </div>
            <p>
              Developed and integrated RESTful APIs improving system response time by 30%. Built responsive interfaces using React.js contributing to 25% reduction in page load times.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full-Stack Developer</h4>
                <h5>Voorent, Remote</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Mastered interactive dashboards and user interfaces using modern Design principles resulting in a 30% increase in feature adoption through collaborative user research.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;

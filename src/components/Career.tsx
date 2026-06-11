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
              Engineered Go microservices (with Kotlin & Spring Boot) for a global logistics platform handling 50K+ daily orders across 30+ manufacturing plants. Architected event-driven AWS infrastructure using ECS, Lambda, RDS, and DynamoDB, reducing costs by 25%. Led migration of legacy COBOL/DB2 mainframe systems to a modern cloud-native Go architecture.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full-Stack Developer</h4>
                <h5>Medtechsecure, Pune</h5>
              </div>
              <h3>2023 - 2024</h3>
            </div>
            <p>
              Developed Golang REST APIs and backend services supporting healthcare workflow automation. Designed and optimized PostgreSQL database schemas, built React-based frontend modules integrated with Go microservices, and implemented authentication, role-based access control, and automated CI/CD pipelines.
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
              Built robust CI/CD pipelines and containerized services using Docker and Kubernetes. Collaborated in Agile teams, owning features from design through deployment and monitoring to improve system reliability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;

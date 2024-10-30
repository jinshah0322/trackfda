// components/Timeline.js
const Timeline = ({ actions }) => (
    <div className="timeline">
      {actions.map((action, index) => (
        <div key={index} className="timeline-item">
          <div className="circle" />
          <div className="content">
            <h3>{action.title}</h3>
            <span className="date">{new Date(action.date).toLocaleDateString()}</span>
            <p>{action.description}</p>
          </div>
        </div>
      ))}
      <style jsx>{`
        .timeline {
          position: relative;
          padding-left: 20px;
        }
        .timeline-item {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .circle {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #00bfff;
          margin-right: 10px;
        }
        .content {
          border-left: 2px solid #e0e0e0;
          padding-left: 10px;
        }
        .date {
          font-size: 0.9rem;
          color: #999;
        }
        h3 {
          margin: 0;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
  
  export default Timeline;
  
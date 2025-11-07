import React from 'react';
import { motion } from 'framer-motion';
import './InstructorCard.css';
const BASE_URL = "https://mariam2909-001-site1.anytempurl.com";
const InstructorCard = ({ instructor, delay = 0 }) => {
  const getJobTitleName = (jobTitle) => {
    const titles = {
    1: 'Fullstack Developer',
    2: 'Backend Developer',
    3: 'Frontend Developer',
    4: 'UX/UI Designer',
    5: 'AiEngineer',
    6: 'DataScientist',
    7: 'MobileDeveloper',
    8: 'MarketingSpecialist',
    9: 'CloudEngineer',
    10:'SecurityAnalyst'
    };
    return titles[jobTitle] || 'Instructor';
  };

  return (
    <motion.div
      className="instructor-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8 }}
    >
      <div className="instructor-image">
        <img 
            src={`${BASE_URL}${instructor.image}`}
            //src={`${BASE_URL}/assets/images/instructors/${instructor.image}`}
          alt={`${instructor.firstName} ${instructor.lastName}`}
        />
      </div>
      <div className="instructor-info">
        <h3 className="instructor-name">{instructor.firstName} {instructor.lastName}</h3>
        <p className="instructor-title">{getJobTitleName(instructor.jobTitle)}</p>
        <p className="instructor-bio">{instructor.bio?.substring(0, 80)}...</p>
      </div>
    </motion.div>
  );
};

export default InstructorCard;
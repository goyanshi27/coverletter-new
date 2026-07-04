/**
 * Template Database
 * Message templates for networking, emails, and cover letters
 */

const TemplateDatabase = {
  // Cover Letter Templates
  coverLetters: {
    fresher: {
      name: 'Fresher / Recent Graduate',
      structure: 'enthusiasm-first',
      sections: ['opening', 'education-highlight', 'skills', 'projects', 'motivation', 'closing'],
      tone: 'eager, professional, growth-oriented'
    },
    internship: {
      name: 'Internship Application',
      structure: 'learning-focused',
      sections: ['opening', 'academic-background', 'relevant-coursework', 'projects', 'availability', 'closing'],
      tone: 'enthusiastic, humble, eager to learn'
    },
    careerChange: {
      name: 'Career Change',
      structure: 'transferable-skills-first',
      sections: ['opening', 'current-experience', 'transferable-skills', 'new-field-qualifications', 'motivation', 'closing'],
      tone: 'confident, adaptable, clear narrative'
    },
    referral: {
      name: 'Referral Application',
      structure: 'connection-first',
      sections: ['referral-opening', 'qualifications', 'company-interest', 'experience', 'closing'],
      tone: 'personable, grateful, professional'
    },
    experienced: {
      name: 'Experienced Professional',
      structure: 'achievement-first',
      sections: ['opening', 'key-achievements', 'relevant-experience', 'skills', 'company-fit', 'closing'],
      tone: 'confident, results-oriented, strategic'
    },
    startup: {
      name: 'Startup Application',
      structure: 'value-proposition-first',
      sections: ['personal-opening', 'problem-solving', 'adaptability', 'growth-mindset', 'impact', 'closing'],
      tone: 'passionate, flexible, ownership-driven'
    },
    corporate: {
      name: 'Corporate Application',
      structure: 'professional-standard',
      sections: ['formal-opening', 'qualifications', 'achievements', 'company-alignment', 'professional-value', 'closing'],
      tone: 'polished, formal, structured'
    }
  },

  // Networking Message Templates
  networking: {
    linkedinConnection: [
      {
        name: 'Professional Connection',
        template: `Hi {name},

I came across your profile while researching {industry/company} and was impressed by your work in {field}. I'm currently {your_situation} and would love to connect to learn from your experience.

I'd appreciate the opportunity to connect and potentially discuss {specific_topic}.

Best regards,
{your_name}`
      },
      {
        name: 'Shared Interest',
        template: `Hi {name},

I noticed we share a common interest in {shared_interest} through {context}. Your insights on {topic} resonated with my own experience in {your_experience}.

I'd love to connect and exchange perspectives on {topic}.

Best,
{your_name}`
      },
      {
        name: 'Alumni Connection',
        template: `Hi {name},

I noticed we're both {university} alumni! I'm currently {current_role} and saw your impressive journey to {their_role} at {company}.

Would love to connect and learn from your experience in {field}.

Go {mascot}!
{your_name}`
      }
    ],
    recruiterOutreach: [
      {
        name: 'Inquiry',
        template: `Dear {recruiter_name},

I hope this message finds you well. I'm reaching out regarding the {position} role at {company}. With my background in {background}, I believe I could contribute significantly to {specific_area}.

I'd love to learn more about the opportunity and discuss how my skills align with the team's needs.

Would you be available for a brief call this week?

Best regards,
{your_name}
{phone}
{linkedin}`
      },
      {
        name: 'Follow-up Application',
        template: `Dear {recruiter_name},

I wanted to follow up on my application for the {position} role submitted on {date}. I remain very interested in the opportunity to contribute to {company}'s {specific_team/goal}.

Since applying, I've {additional_achievement} which I believe further demonstrates my fit for this role.

Is there any additional information I can provide? I'd be happy to discuss my qualifications further.

Thank you for your time and consideration.

Best regards,
{your_name}`
      }
    ],
    hiringManager: [
      {
        name: 'Direct Outreach',
        template: `Dear {manager_name},

I've been following {company}'s work in {area} and am particularly impressed by {specific_project/achievement}. The {position} role caught my attention as it aligns perfectly with my {background/skills}.

In my current role at {current_company}, I've {key_achievement} which directly relates to {their_need}. I believe my experience with {specific_skills} could help drive {their_goal}.

Would you be open to a brief conversation about how I might contribute to your team's objectives?

Best regards,
{your_name}`
      }
    ],
    referralRequest: [
      {
        name: 'Professional Referral',
        template: `Hi {contact_name},

I hope you're doing well! I noticed an opening for {position} at {company} and remembered you're part of the team there.

Given my experience with {relevant_skills}, I believe I'd be a great fit for this role. I'd be grateful if you could share any insights about the team culture or the role requirements.

If you think I'd be a good match, would you be willing to refer me? I'm confident I can contribute to {specific_area} and would value your endorsement.

Happy to chat if you have any questions.

Thanks,
{your_name}`
      }
    ],
    followUp: [
      {
        name: 'Post-Interview',
        template: `Dear {interviewer_name},

Thank you for taking the time to discuss the {position} role at {company}. Our conversation about {specific_topic} reinforced my enthusiasm for the opportunity.

I particularly enjoyed discussing {memorable_point} and have been reflecting on {insight_question}. I'm confident my {specific_skill} would help address {their_challenge} we discussed.

I'd love to hear about next steps. Please don't hesitate to reach out if you need any additional information.

Best regards,
{your_name}`
      },
      {
        name: 'General Follow-up',
        template: `Hi {name},

I wanted to follow up on our conversation from {when} about {topic}. I've {action_taken} as discussed and wanted to share {update}.

Have you had a chance to {their_action}? I'd be happy to {offer} if that would be helpful.

Looking forward to hearing from you.

Best,
{your_name}`
      }
    ]
  },

  // Thank You Email Templates
  thankYou: {
    postInterview: [
      {
        name: 'Technical Interview',
        template: `Subject: Thank You - {position} Interview

Dear {interviewer_name},

Thank you for the engaging technical discussion today. I especially enjoyed the {specific_problem/exercise} we worked through — it gave me great insight into the types of challenges {team_name} tackles.

Our conversation about {technical_topic} has me even more excited about contributing to {company}. I'm confident my experience with {relevant_skill} would enable me to {value_proposition}.

I look forward to hearing about next steps. Please let me know if you need any additional information.

Best regards,
{your_name}`
      },
      {
        name: 'Behavioral Interview',
        template: `Subject: Thank You - {position} Interview

Dear {interviewer_name},

Thank you for the wonderful conversation about the {position} role. Learning about {company}'s approach to {value/topic} and the team's focus on {specific_area} was truly inspiring.

I've reflected on our discussion about {interview_topic}, and it resonated deeply with my own commitment to {relevant_value}. I believe my {experience} aligns well with the team's mission.

I'm excited about the possibility of contributing to {company}'s continued success in {area}. Looking forward to hearing about next steps.

Best,
{your_name}`
      }
    ],
    recruiterThank: {
      name: 'Recruiter Appreciation',
      template: `Subject: Thank You for Your Guidance

Dear {recruiter_name},

I wanted to express my gratitude for your support throughout the interview process for {position} at {company}. Your insights about {company_culture/team} were invaluable in helping me prepare effectively.

The professionalism and warmth you demonstrated made the entire experience seamless. I appreciate you taking the time to {specific_help_provided}.

Regardless of the outcome, it was a pleasure working with you. Thank you again for your guidance.

Best regards,
{your_name}`
    },
    hrAppreciation: {
      name: 'HR Appreciation',
      template: `Subject: Thank You - {position} Application Process

Dear {hr_name},

I wanted to thank you and the HR team for the smooth and professional recruitment process for the {position} role. The clear communication and timely updates made a significant difference in my experience.

I appreciate the time everyone invested in helping me understand the role and the company culture. The {company_name} team's professionalism throughout has only strengthened my interest in joining.

Thank you again for this opportunity. I look forward to hearing about next steps.

Best regards,
{your_name}`
    }
  },

  // Salary Negotiation Templates
  salaryNegotiation: {
    negotiation: {
      name: 'Salary Negotiation',
      template: `Subject: Discussing {position} Offer - {your_name}

Dear {hr_name},

Thank you for extending the offer for the {position} position. I'm genuinely excited about the opportunity to join {company} and contribute to {team_goal}.

After reviewing the offer details, I'd like to discuss the compensation package. Based on my research and considering my {specific_experience/credentials}, I was expecting a range closer to {target_range}.

Given my {key_skills} and track record of {achievements}, I believe this adjustment would better reflect the value I can bring to the role. I'm confident I can deliver significant impact in areas like {specific_contribution}.

I'm very interested in joining {company} and hope we can find terms that work for both sides. Could we schedule a call to discuss this further?

Thank you for your consideration.

Best regards,
{your_name}`
    },
    counterOffer: {
      name: 'Counter Offer',
      template: `Subject: Re: Offer for {position} Position

Dear {hr_name},

Thank you for the revised offer. I appreciate your flexibility and the time you've invested in this process.

While the updated offer shows progress, I'd like to propose meeting in the middle at {middle_number}. This would reflect fair market value for this role given my {qualifications} and would enable me to commit with full confidence.

I'm excited about {company}'s mission and am eager to contribute to {specific_goal}. I believe this adjustment represents a fair compromise that recognizes both parties' needs.

I'm ready to make my decision as soon as we can align on this final point. Please let me know if this works.

Best,
{your_name}`
    },
    acceptance: {
      name: 'Offer Acceptance',
      template: `Subject: Accepting Offer - {position} Position

Dear {hr_name},

I'm delighted to accept the offer for the {position} position at {company}. Thank you for the opportunity to join such an innovative team.

Per our discussion, I confirm my acceptance of the following terms:
- Position: {position}
- Start Date: {start_date}
- Salary: {salary}
- Benefits: {benefits_summary}

I'm excited to contribute to {team_goal} and look forward to working with everyone. Please let me know the next steps and any documents I need to complete before my start date.

Thank you again for this opportunity.

Best regards,
{your_name}`
    },
    rejection: {
      name: 'Offer Decline',
      template: `Subject: Regarding Offer for {position} Position

Dear {hr_name},

Thank you for offering me the {position} position at {company}. I genuinely appreciate the time and effort everyone invested in this process.

After careful consideration, I've decided to decline this offer. This was a difficult decision, as I was impressed by {specific_positive_aspect} and the team's dedication to {company_mission}.

I hope we can stay connected for potential future opportunities. Thank you again for your consideration, and I wish you and the team all the best.

Best regards,
{your_name}`
    },
    joiningDelay: {
      name: 'Joining Date Delay Request',
      template: `Subject: Request for Start Date Adjustment - {your_name}

Dear {hr_name},

I'm writing to request an adjustment to my start date for the {position} position.

Originally scheduled for {current_start_date}, I'd like to propose {new_start_date} instead. This is due to {reason: current project completion/family commitment/relocation}. I want to ensure I can give my full attention to {company} from day one.

I'm fully committed to joining and will use this additional time to {preparation_plan}. I've also discussed this with {manager_name} and wanted to formalize it with HR.

Please let me know if this works or if you need any additional information.

Thank you for your understanding.

Best regards,
{your_name}`
    }
  },

  // Message placeholders help text
  placeholders: {
    name: 'Contact person\'s name',
    your_name: 'Your full name',
    position: 'Position title',
    company: 'Company name',
    industry: 'Industry name',
    field: 'Field of expertise',
    your_situation: 'Your current professional situation',
    specific_topic: 'Topic you want to discuss',
    shared_interest: 'Common professional interest',
    topic: 'Specific topic or skill',
    your_experience: 'Your relevant experience',
    their_role: 'Their job title',
    background: 'Your professional background',
    specific_area: 'Specific department or area',
    phone: 'Your phone number',
    linkedin: 'Your LinkedIn profile',
    date: 'Application or conversation date',
    additional_achievement: 'Recent relevant achievement',
    manager_name: 'Hiring manager\'s name',
    specific_project: 'Notable company project',
    key_achievement: 'Your key professional achievement',
    their_need: 'Known company need or challenge',
    specific_skills: 'Relevant technical skills',
    their_goal: 'Team or company goal',
    current_company: 'Your current employer',
    contact_name: 'Your connection\'s name',
    relevant_skills: 'Skills relevant to the position',
    when: 'Time of previous conversation',
    action_taken: 'Action you\'ve taken since',
    update: 'Relevant update to share',
    their_action: 'Action expected from them',
    offer: 'How you can help them',
    interviewer_name: 'Interviewer\'s name',
    specific_problem: 'Problem discussed in interview',
    team_name: 'Team you\'re applying to',
    technical_topic: 'Technical subject discussed',
    value_proposition: 'Value you can provide',
    interview_topic: 'Topic discussed in interview',
    experience: 'Your relevant experience',
    recruiter_name: 'Recruiter\'s name',
    company_culture: 'Aspect of company culture',
    specific_help: 'Specific assistance provided',
    hr_name: 'HR contact\'s name',
    team_goal: 'Team\'s objective or goal',
    target_range: 'Your salary range expectation',
    key_skills: 'Your key skills',
    achievements: 'Your notable achievements',
    specific_contribution: 'Area you can contribute to',
    middle_number: 'Middle ground salary figure',
    qualifications: 'Your qualifications',
    start_date: 'Your start date',
    salary: 'Agreed salary',
    benefits_summary: 'Summary of benefits',
    specific_positive_aspect: 'Positive aspect noted',
    current_start_date: 'Originally agreed date',
    new_start_date: 'Proposed new date',
    reason: 'Reason for change',
    preparation_plan: 'How you\'ll prepare',
    mascot: 'University mascot name',
    university: 'University name'
  },

  // Template categories for UI
  categories: [
    { id: 'networking', name: 'Networking Messages', icon: 'fa-users' },
    { id: 'thankYou', name: 'Thank You Emails', icon: 'fa-envelope' },
    { id: 'salaryNegotiation', name: 'Salary Negotiation', icon: 'fa-dollar-sign' },
    { id: 'coverLetters', name: 'Cover Letters', icon: 'fa-file-alt' }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TemplateDatabase };
}

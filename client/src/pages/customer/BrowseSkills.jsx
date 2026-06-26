import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import providerService from '../../services/providerService.js';
import Button from '../../components/common/Button.jsx';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import Card from '../../components/common/Card.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const BrowseSkills = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await providerService.getSkills();
        setSkills(data);
      } catch (err) {
        console.error('Error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleSkillSelect = (skillId) => {
    navigate(`/?skill=${skillId}`);
  };

  // Group skills by category
  const groupedSkills = skills.reduce((groups, skill) => {
    const category = skill.category || 'Other Services';
    if (!groups[category]) groups[category] = [];
    groups[category].push(skill);
    return groups;
  }, {});

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 hover:bg-gray-50 border border-border rounded-xl text-textSecondary hover:text-textPrimary transition tap-target-btn flex items-center justify-center"
            style={{ minHeight: '48px', minWidth: '48px' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-textPrimary leading-tight">
              Skill Categories
            </h1>
            <p className="text-textSecondary text-sm mt-0.5">
              Select a service skill to find local providers nearby.
            </p>
          </div>
        </div>

        {loading ? (
          <Spinner className="py-20" size="lg" />
        ) : (
          <div className="flex flex-col gap-8 mt-2">
            {Object.keys(groupedSkills).map((categoryName) => (
              <div key={categoryName} className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-textPrimary border-b border-border pb-2 flex items-center gap-2">
                  <Sparkles size={16} className="text-teal-primary" />
                  {categoryName}
                </h2>
                
                {/* Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {groupedSkills[categoryName].map((skill) => (
                    <Card
                      key={skill._id}
                      onClick={() => handleSkillSelect(skill._id)}
                      className="flex items-center gap-4 p-5 hover:border-teal-primary"
                    >
                      <span className="text-3xl shrink-0" role="img" aria-label={skill.name}>
                        {skill.icon}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-heading font-bold text-base text-textPrimary">
                          {skill.name}
                        </span>
                        <span className="text-xs text-textSecondary mt-0.5">
                          Browse local experts
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default BrowseSkills;

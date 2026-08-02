const SectionHeading = ({ eyebrow, title }) => {
  return (
    <div className="section-heading reveal">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  );
};

export default SectionHeading;

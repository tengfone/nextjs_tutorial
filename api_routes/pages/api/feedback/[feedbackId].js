import { buildFeedbackPath, extractFeedback } from "./index";

export default function handler(req, res) {
  const feedbackId = req.query.feedbackId;
  const filePath = buildFeedbackPath();
  const feedbackData = extractFeedback(filePath);
  const feedback = feedbackData.find((feedback) => feedback.id === feedbackId);
  if (!feedback) {
    res.status(404).json({ error: "Feedback not found" });
  } else {
    res.status(200).json({ feedback: feedback });
  }
}

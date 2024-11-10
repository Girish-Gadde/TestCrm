import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RadioButton } from "react-native-paper";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from "accordion-collapse-react-native";

const CrmStart = () => {
  const [answers, setAnswers] = useState({
    accordion1: Array(5).fill("No"),
    accordion2: Array(5).fill("No"),
    accordion3: Array(5).fill("No"),
    accordion4: Array(5).fill("No"),
  });
  const [editableAccordion, setEditableAccordion] = useState(1);
  const [modifiedAccordions, setModifiedAccordions] = useState({});
  const [openAccordion, setOpenAccordion] = useState(null);

  const questions = [
    "All objections regarding price, quality, delivery etc successfully tackled and customer is in favour of our machine",
    "Negotiating in progress",
    "All points satisfied from 1 to 8 and customer likely to finalize with in the next 1 months time",
    "Question 4?",
    "Question 5?",
  ];

  const handleAnswerChange = (accordion, index, answer) => {
    if (editableAccordion === 1 && accordion !== "accordion1") {
      Alert.alert(
        "Access Denied",
        "You can't edit this accordion if 'No' is selected in the first accordion."
      );
      return;
    }

    const updatedAnswers = { ...answers };
    updatedAnswers[accordion][index] = answer;
    setAnswers(updatedAnswers);

    // Mark this accordion as modified
    setModifiedAccordions((prev) => ({
      ...prev,
      [accordion]: true,
    }));
  };

  const handleSave = (accordion) => {
    // Allow saving even if not all questions are answered "Yes" or "NA"
    // Check if all answers in the current accordion are "Yes" or "NA"
    const allAnsweredYesOrNA = answers[accordion].every(
      (ans) => ans === "Yes" || ans === "NA"
    );

    if (accordion === "accordion1") {
      // If any answer in the first accordion is "No", reset editableAccordion to 1
      const anyNoAnswer = answers[accordion].some((ans) => ans === "No");

      if (anyNoAnswer) {
        setEditableAccordion(1); // Lock all other accordions
      } else if (allAnsweredYesOrNA && editableAccordion === 1) {
        setEditableAccordion(2); // Enable the second accordion
      }
    } else if (
      allAnsweredYesOrNA &&
      editableAccordion === parseInt(accordion.slice(-1))
    ) {
      // For subsequent accordions, enable the next accordion if all answers are "Yes" or "NA"
      setEditableAccordion((prev) => prev + 1);
    }

    // Reset the modified state after saving
    setModifiedAccordions((prev) => ({
      ...prev,
      [accordion]: false,
    }));
  };

  const handleCancel = (accordion) => {
    // Reset the answers to their original state
    setAnswers((prev) => ({
      ...prev,
      [accordion]: Array(5).fill("No"),
    }));
    setModifiedAccordions((prev) => ({
      ...prev,
      [accordion]: false, // Reset modified state after canceling
    }));
  };

  const renderQuestions = (accordionName) => {
    return questions.map((question, index) => (
      <View key={index} style={styles.questionContainer}>
        <Text style={styles.questionText}>{question}</Text>
        <RadioButton.Group
          onValueChange={(value) =>
            handleAnswerChange(accordionName, index, value)
          }
          value={answers[accordionName][index]}
        >
          <View style={styles.radioContainer}>
            <Text>Yes</Text>
            <RadioButton value="Yes" />
            <Text>No</Text>
            <RadioButton value="No" />
            <Text>NA</Text>
            <RadioButton value="NA" />
          </View>
        </RadioButton.Group>
      </View>
    ));
  };

  const renderAccordionButtons = (accordion) => {
    if (!modifiedAccordions[accordion]) return null; // Only render if modified

    return (
      <View style={styles.buttonContainer}>
        <View style={styles.buttonStyle}>
          <Button title="Save" onPress={() => handleSave(accordion)} />
        </View>
        <View style={styles.buttonStyle}>
          <Button title="Cancel" onPress={() => handleCancel(accordion)} />
        </View>
      </View>
    );
  };

  const renderAccordion = (num) => {
    const isAccordionOpen = openAccordion === num;
    return (
      <Collapse
        key={num}
        isCollapsed={isAccordionOpen}
        disabled={editableAccordion < num} // Lock accordion if it's not yet editable
        onToggle={() => setOpenAccordion((prev) => (prev === num ? null : num))}
      >
        <CollapseHeader>
          <View style={styles.accordionHeader}>
            <Text style={styles.accordionTitle}>Accordion {num}</Text>
            <Icon
              name={isAccordionOpen ? "arrow-downward" : "arrow-forward-ios"}
              size={20}
              color="black"
            />
          </View>
        </CollapseHeader>
        <CollapseBody style={styles.accordionBody}>
          {renderQuestions(`accordion${num}`)}
          {renderAccordionButtons(`accordion${num}`)}
        </CollapseBody>
      </Collapse>
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {[1, 2, 3, 4].map((num) => renderAccordion(num))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    marginTop: 40,
  },
  accordionHeader: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
    paddingHorizontal: 10,
  },
  accordionBody: {
    paddingBottom: 50, // Add space below the content for buttons
    paddingHorizontal: 16,
    marginBottom: 20,
    width: "90%",
  },
  questionContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  questionText: {
    fontSize: 16,
    marginBottom: 5,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  buttonStyle: {
    flex: 1, // Ensures each button takes equal width
    marginHorizontal: 10, // Adds space between buttons
  },
});

export default CrmStart;

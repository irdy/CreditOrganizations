import React from 'react';
import { Button } from 'reactstrap';
import { useNavigate } from "react-router";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button className={"text-white"} color='success' onClick={() => navigate(-1)}>
      Назад
    </Button>
  )
};

export default BackButton;

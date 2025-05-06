package com.example.wealthverse.Repository;

import com.example.wealthverse.Model.Notification;
import com.example.wealthverse.Model.User;
import com.example.wealthverse.Enums.NotificationType;
import com.example.wealthverse.Enums.ReferenceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    List<Notification> findByUser(User user);

    List<Notification> findByUserAndIsReadFalse(User user);

    List<Notification> findByUserAndType(User user, NotificationType type);

    List<Notification> findByReferenceTypeAndReferenceId(ReferenceType referenceType, int referenceId);
}

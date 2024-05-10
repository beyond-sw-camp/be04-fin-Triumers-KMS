package org.triumers.kmsback.auth.command.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.triumers.kmsback.auth.command.domain.aggregate.entity.Auth;

@Repository
public interface AuthRepository extends JpaRepository<Auth, Integer> {// Git 충돌 복구용 주석
    Auth findByEmail(String email);
}
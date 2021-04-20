"""empty message

Revision ID: 3082eb3f1ba9
Revises: cfe6b70cd985
Create Date: 2021-04-19 03:50:26.374275

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3082eb3f1ba9'
down_revision = 'cfe6b70cd985'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('cars', 'description')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('cars', sa.Column('description', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
    # ### end Alembic commands ###